import { getSupabaseClient } from './supabase';
import { UserProfile, UserRole } from '../types';

const DEMO_USERS: Record<string, UserProfile> = {
  admin: {
    id: 'user-admin-01',
    email: 'admin@hyderabadheights.in',
    full_name: 'Praveen Kumar (Portal Admin)',
    phone: '+91 90000 12345',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    created_at: new Date().toISOString()
  },
  agent: {
    id: 'owner-sample-02',
    email: 'radhika.reddy@hydproperties.com',
    full_name: 'Radhika Reddy (Authorized Agent)',
    phone: '+91 97012 98765',
    role: 'agent',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    created_at: new Date().toISOString()
  },
  owner: {
    id: 'owner-sample-01',
    email: 'suresh.varma@gmail.com',
    full_name: 'Suresh Varma (Direct Property Owner)',
    phone: '+91 98490 12345',
    role: 'user',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    created_at: new Date().toISOString()
  },
  buyer: {
    id: 'user-buyer-01',
    email: 'kalyan.sharma@outlook.com',
    full_name: 'Kalyan Sharma (Home Buyer)',
    phone: '+91 99555 44332',
    role: 'user',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    created_at: new Date().toISOString()
  }
};

const SESSION_STORAGE_KEY = 'manaproperty_active_user';

export class AuthService {
  private static listeners: Array<(user: UserProfile | null) => void> = [];

  static getCurrentUser(): UserProfile | null {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return null;
  }

  static setCurrentUser(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    this.notifyListeners(user);
  }

  static subscribe(callback: (user: UserProfile | null) => void) {
    this.listeners.push(callback);
    callback(this.getCurrentUser());
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private static notifyListeners(user: UserProfile | null) {
    this.listeners.forEach(cb => cb(user));
  }

  static async switchDemoRole(roleKey: 'admin' | 'agent' | 'owner' | 'buyer'): Promise<UserProfile> {
    const user = DEMO_USERS[roleKey];
    this.setCurrentUser(user);
    return user;
  }

  static async loginWithEmail(email: string, _password: string): Promise<{ user: UserProfile | null; error?: string }> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email,
          password: _password
        });
        if (error) {
          return { user: null, error: error.message };
        }
        if (data.user) {
          // Fetch profile
          const { data: profile } = await client
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const userProfile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: profile?.full_name || email.split('@')[0],
            phone: profile?.phone || '',
            role: (profile?.role as UserRole) || 'user',
            avatar_url: profile?.avatar_url,
            created_at: profile?.created_at || new Date().toISOString()
          };
          this.setCurrentUser(userProfile);
          return { user: userProfile };
        }
      } catch (err: unknown) {
        return { user: null, error: err instanceof Error ? err.message : 'Login failed' };
      }
    }

    // Fallback simulation
    const match = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
    const user: UserProfile = match || {
      id: 'usr-' + Date.now(),
      email,
      full_name: email.split('@')[0],
      phone: '+91 98765 43210',
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
      created_at: new Date().toISOString()
    };
    this.setCurrentUser(user);
    return { user };
  }

  static async signUp(
    email: string,
    _password: string,
    fullName: string,
    phone: string,
    role: UserRole
  ): Promise<{ user: UserProfile | null; error?: string }> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.auth.signUp({
          email,
          password: _password,
          options: {
            data: { full_name: fullName, phone, role }
          }
        });
        if (error) {
          return { user: null, error: error.message };
        }
        if (data.user) {
          // Insert profile
          await client.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName,
            phone,
            role
          });

          const userProfile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName,
            phone,
            role,
            created_at: new Date().toISOString()
          };
          this.setCurrentUser(userProfile);
          return { user: userProfile };
        }
      } catch (err: unknown) {
        return { user: null, error: err instanceof Error ? err.message : 'Signup failed' };
      }
    }

    // Fallback simulation
    const userProfile: UserProfile = {
      id: 'usr-' + Date.now(),
      email,
      full_name: fullName,
      phone,
      role,
      created_at: new Date().toISOString()
    };
    this.setCurrentUser(userProfile);
    return { user: userProfile };
  }

  static async logout() {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch {
        // ignore
      }
    }
    this.setCurrentUser(null);
  }
}
