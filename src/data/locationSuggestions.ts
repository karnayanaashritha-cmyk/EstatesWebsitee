export type LocationSuggestionType = 'city' | 'locality' | 'area' | 'project';

export interface LocationSuggestion {
  id: string;
  name: string;
  subtext: string;
  type: LocationSuggestionType;
  city: string;
  popular?: boolean;
}

export const LOCATION_SUGGESTIONS: LocationSuggestion[] = [
  // --- Major Cities ---
  {
    id: 'city-hyd',
    name: 'Hyderabad',
    subtext: 'Telangana, India',
    type: 'city',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'city-blr',
    name: 'Bangalore',
    subtext: 'Karnataka, India',
    type: 'city',
    city: 'Bangalore',
    popular: true,
  },
  {
    id: 'city-mum',
    name: 'Mumbai',
    subtext: 'Maharashtra, India',
    type: 'city',
    city: 'Mumbai',
    popular: false,
  },
  {
    id: 'city-del',
    name: 'Delhi NCR',
    subtext: 'National Capital Region',
    type: 'city',
    city: 'Delhi',
    popular: false,
  },
  {
    id: 'city-che',
    name: 'Chennai',
    subtext: 'Tamil Nadu, India',
    type: 'city',
    city: 'Chennai',
    popular: false,
  },
  {
    id: 'city-pun',
    name: 'Pune',
    subtext: 'Maharashtra, India',
    type: 'city',
    city: 'Pune',
    popular: false,
  },

  // --- Key Localities in Hyderabad ---
  {
    id: 'loc-gachibowli',
    name: 'Gachibowli',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'loc-kokapet',
    name: 'Kokapet',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'loc-madhapur',
    name: 'Madhapur',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'loc-kukatpally',
    name: 'Kukatpally',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'loc-kondapur',
    name: 'Kondapur',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'loc-tellapur',
    name: 'Tellapur',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'loc-financial-district',
    name: 'Financial District',
    subtext: 'Nanakramguda, Hyderabad',
    type: 'locality',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'loc-narsingi',
    name: 'Narsingi',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'loc-manikonda',
    name: 'Manikonda',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'loc-miyapur',
    name: 'Miyapur',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'loc-hitec-city',
    name: 'HITEC City',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'loc-banjara-hills',
    name: 'Banjara Hills',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: false,
  },
  {
    id: 'loc-jubilee-hills',
    name: 'Jubilee Hills',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: false,
  },
  {
    id: 'loc-begumpet',
    name: 'Begumpet',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: false,
  },
  {
    id: 'loc-kompally',
    name: 'Kompally',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: false,
  },
  {
    id: 'loc-chandanagar',
    name: 'Chandanagar',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: false,
  },
  {
    id: 'loc-bachupally',
    name: 'Bachupally',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: false,
  },
  {
    id: 'loc-shamshabad',
    name: 'Shamshabad',
    subtext: 'Hyderabad Airport Corridor',
    type: 'locality',
    city: 'Hyderabad',
    popular: false,
  },
  {
    id: 'loc-attapur',
    name: 'Attapur',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: false,
  },
  {
    id: 'loc-nallagandla',
    name: 'Nallagandla',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: false,
  },
  {
    id: 'loc-lb-nagar',
    name: 'LB Nagar',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: false,
  },
  {
    id: 'loc-uppal',
    name: 'Uppal',
    subtext: 'Hyderabad, Telangana',
    type: 'locality',
    city: 'Hyderabad',
    popular: false,
  },

  // --- Prominent Areas (like South Delhi, West Hyderabad) ---
  {
    id: 'area-south-delhi',
    name: 'South Delhi',
    subtext: 'New Delhi, Delhi NCR',
    type: 'area',
    city: 'Delhi',
    popular: true,
  },
  {
    id: 'area-whitefield',
    name: 'Whitefield',
    subtext: 'Bangalore, Karnataka',
    type: 'area',
    city: 'Bangalore',
    popular: true,
  },
  {
    id: 'area-indiranagar',
    name: 'Indiranagar',
    subtext: 'Bangalore, Karnataka',
    type: 'area',
    city: 'Bangalore',
    popular: false,
  },
  {
    id: 'area-west-hyd',
    name: 'Outer Ring Road (ORR) Corridor',
    subtext: 'Gachibowli - Kokapet - Narsingi, Hyderabad',
    type: 'area',
    city: 'Hyderabad',
    popular: true,
  },

  // --- Verified Projects and Builders in the catalog ---
  {
    id: 'proj-golden-mile',
    name: 'Kokapet Golden Mile',
    subtext: 'Project in Kokapet, Hyderabad',
    type: 'project',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'proj-emerald-greens',
    name: 'Emerald Greens Enclave',
    subtext: 'Luxury Villas in Tellapur, Hyderabad',
    type: 'project',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'proj-serene-heights',
    name: 'Serene Heights',
    subtext: 'Gated Community in Gachibowli, Hyderabad',
    type: 'project',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'proj-metro-view',
    name: 'Metro View Towers',
    subtext: 'High-Rise in Miyapur, Hyderabad',
    type: 'project',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'proj-royal-meadows',
    name: 'Royal Meadows Layout',
    subtext: 'HMDA & RERA Plots in Narsingi, Hyderabad',
    type: 'project',
    city: 'Hyderabad',
    popular: false,
  },
  {
    id: 'proj-apex-it',
    name: 'Apex IT Park',
    subtext: 'Commercial Tech Park in Financial District',
    type: 'project',
    city: 'Hyderabad',
    popular: false,
  },
  {
    id: 'proj-lake-view',
    name: 'Lake View Enclave',
    subtext: 'Gated Villas in Kukatpally, Hyderabad',
    type: 'project',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'proj-lanco-hills',
    name: 'Lanco Hills',
    subtext: 'Mega Township in Manikonda, Hyderabad',
    type: 'project',
    city: 'Hyderabad',
    popular: false,
  },
  {
    id: 'proj-aparna-serene',
    name: 'Aparna Serene Park',
    subtext: 'Residential Complex in Kondapur, Hyderabad',
    type: 'project',
    city: 'Hyderabad',
    popular: true,
  },
  {
    id: 'proj-my-home-bhooja',
    name: 'My Home Bhooja',
    subtext: 'Ultra Luxury in HITEC City, Hyderabad',
    type: 'project',
    city: 'Hyderabad',
    popular: true,
  },
];

/**
 * Filter suggestions by text query and optionally by type
 */
export function searchLocationSuggestions(
  query: string,
  typeFilter?: LocationSuggestionType,
  excludeNames: string[] = []
): LocationSuggestion[] {
  const normalizedQuery = query.toLowerCase().trim();
  const lowerExcludes = excludeNames.map(n => n.toLowerCase());

  return LOCATION_SUGGESTIONS.filter(item => {
    // Exclude already selected
    if (lowerExcludes.includes(item.name.toLowerCase())) {
      return false;
    }

    // Filter by type if specified
    if (typeFilter && item.type !== typeFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return item.popular;
    }

    return (
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.subtext.toLowerCase().includes(normalizedQuery) ||
      item.city.toLowerCase().includes(normalizedQuery)
    );
  }).slice(0, 10);
}
