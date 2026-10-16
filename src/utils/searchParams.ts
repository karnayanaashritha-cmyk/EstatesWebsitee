import { PropertyFilterParams, ListingType } from '../types';

/**
 * Serializes PropertyFilterParams into a URL query string
 */
export function filtersToQueryParams(filters: Partial<PropertyFilterParams>): string {
  const params = new URLSearchParams();

  if (filters.localities && filters.localities.length > 0) {
    params.set('locations', filters.localities.join(','));
  } else if (filters.locality && filters.locality !== 'all') {
    params.set('locality', filters.locality);
  }

  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    params.set('types', filters.propertyTypes.join(','));
  } else if (filters.propertyType && filters.propertyType !== 'all') {
    params.set('type', filters.propertyType);
  }

  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    params.set('minPrice', String(filters.minPrice));
  }

  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    params.set('maxPrice', String(filters.maxPrice));
  }

  if (filters.listingType && filters.listingType !== 'all') {
    params.set('listingType', filters.listingType);
  }

  if (filters.searchQuery?.trim()) {
    params.set('q', filters.searchQuery.trim());
  }

  if (filters.bedrooms && filters.bedrooms !== 'all') {
    params.set('bhk', String(filters.bedrooms));
  }

  if (filters.furnishing && filters.furnishing !== 'all') {
    params.set('furnishing', filters.furnishing);
  }

  if (filters.sortBy && filters.sortBy !== 'newest') {
    params.set('sort', filters.sortBy);
  }

  return params.toString();
}

/**
 * Parses a URL search string into PropertyFilterParams
 */
export function queryParamsToFilters(search: string): Partial<PropertyFilterParams> {
  if (!search) return {};

  const query = search.startsWith('?') ? search.slice(1) : search;
  const params = new URLSearchParams(query);
  const filters: Partial<PropertyFilterParams> = {};

  const locationsParam = params.get('locations') || params.get('localities');
  if (locationsParam) {
    const locs = locationsParam.split(',').map(s => s.trim()).filter(Boolean);
    if (locs.length > 0) {
      filters.localities = locs;
      filters.locality = locs[0];
    }
  } else {
    const singleLoc = params.get('locality') || params.get('location');
    if (singleLoc && singleLoc !== 'all') {
      filters.locality = singleLoc.trim();
      filters.localities = [singleLoc.trim()];
    }
  }

  const typesParam = params.get('types') || params.get('propertyTypes');
  if (typesParam) {
    const types = typesParam.split(',').map(s => s.trim()).filter(Boolean);
    if (types.length > 0) {
      filters.propertyTypes = types;
      filters.propertyType = types[0];
    }
  } else {
    const singleType = params.get('type') || params.get('propertyType');
    if (singleType && singleType !== 'all') {
      filters.propertyType = singleType.trim();
      filters.propertyTypes = [singleType.trim()];
    }
  }

  const minPrice = params.get('minPrice');
  if (minPrice && !isNaN(Number(minPrice))) {
    filters.minPrice = Number(minPrice);
  }

  const maxPrice = params.get('maxPrice');
  if (maxPrice && !isNaN(Number(maxPrice))) {
    filters.maxPrice = Number(maxPrice);
  }

  const listingType = params.get('listingType');
  if (listingType && ['buy', 'rent', 'lease', 'all'].includes(listingType)) {
    filters.listingType = listingType as ListingType | 'all';
  }

  const q = params.get('q') || params.get('searchQuery');
  if (q) {
    filters.searchQuery = q.trim();
  }

  const bhk = params.get('bhk') || params.get('bedrooms');
  if (bhk) {
    filters.bedrooms = bhk === 'all' ? 'all' : Number(bhk);
  }

  const furnishing = params.get('furnishing');
  if (furnishing) {
    filters.furnishing = furnishing;
  }

  const sort = params.get('sort') || params.get('sortBy');
  if (sort && ['recommended', 'price_asc', 'price_desc', 'area_desc', 'newest'].includes(sort)) {
    filters.sortBy = sort as PropertyFilterParams['sortBy'];
  }

  return filters;
}
