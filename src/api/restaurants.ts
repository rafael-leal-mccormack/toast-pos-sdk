import { HttpClient } from '../client/http-client';
import { ToastApiResponse } from '../types';
import { 
  Restaurant, 
  RestaurantsListParams, 
  DetailedRestaurant,
  GetRestaurantByIdParams,
  GetRestaurantsByManagementGroupParams,
  RestaurantReference
} from '../types/restaurants';

/**
 * Toast Restaurants API client
 */
export class RestaurantsApi {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get a list of restaurants with optional filtering
   * 
   * @param params Optional query parameters for filtering
   * @returns Promise resolving to an array of restaurants
   */
  private async listRestaurants(params: RestaurantsListParams = {}): Promise<ToastApiResponse<Restaurant[]>> {
    // Build query string from parameters
    const searchParams = new URLSearchParams();
    
    if (params.lastModified) {
      searchParams.append('lastModified', params.lastModified);
    }

    const queryString = searchParams.toString();
    const url = `/partners/v1/restaurants${queryString ? `?${queryString}` : ''}`;

    return this.httpClient.request<Restaurant[]>({
      method: 'GET',
      url,
    });
  }

  /**
   * Get all restaurants (convenience method)
   * 
   * @returns Promise resolving to an array of all restaurants
   */
  async getAllRestaurants(): Promise<ToastApiResponse<Restaurant[]>> {
    return this.listRestaurants();
  }

  /**
   * Get restaurants modified since a specific date
   * 
   * @param date Date in YYYY-MM-DD format or ISO date string
   * @returns Promise resolving to an array of restaurants modified since the date
   */
  async getRestaurantsModifiedSince(date: string): Promise<ToastApiResponse<Restaurant[]>> {
    return this.listRestaurants({ lastModified: date });
  }

  /**
   * Find restaurants by name (case-insensitive search)
   * 
   * @param name Restaurant name to search for
   * @returns Promise resolving to an array of matching restaurants
   */
  async findRestaurantsByName(name: string): Promise<Restaurant[]> {
    const response = await this.listRestaurants();
    
    if (!response.data) {
      return [];
    }

    const searchTerm = name.toLowerCase();
    return response.data.filter(restaurant => 
      restaurant.restaurantName.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get a restaurant by its GUID
   * 
   * @param guid Restaurant GUID to search for
   * @returns Promise resolving to the restaurant if found, null otherwise
   */
  async getRestaurantByGuid(guid: string): Promise<Restaurant | null> {
    const response = await this.listRestaurants();
    
    if (!response.data) {
      return null;
    }

    return response.data.find(restaurant => restaurant.restaurantGuid === guid) || null;
  }

  /**
   * Get active (non-deleted) restaurants only
   * 
   * @param params Optional query parameters for filtering
   * @returns Promise resolving to an array of active restaurants
   */
  async getActiveRestaurants(params: RestaurantsListParams = {}): Promise<Restaurant[]> {
    const response = await this.listRestaurants(params);
    
    if (!response.data) {
      return [];
    }

    return response.data.filter(restaurant => !restaurant.deleted);
  }

  /**
   * Get restaurants by management group GUID (client-side filtering)
   * 
   * @param managementGroupGuid Management group GUID to filter by
   * @returns Promise resolving to an array of restaurants in the management group
   */
  async getRestaurantsByManagementGroup(managementGroupGuid: string): Promise<Restaurant[]> {
    const response = await this.listRestaurants();
    
    if (!response.data) {
      return [];
    }

    return response.data.filter(restaurant => 
      restaurant.managementGroupGuid === managementGroupGuid
    );
  }

  /**
   * Get detailed restaurant information by GUID
   * Uses the /restaurants/v1/restaurants/{guid} endpoint
   * 
   * @param params Parameters including restaurant GUID and external ID
   * @returns Promise resolving to detailed restaurant information
   */
  async getRestaurantById(params: GetRestaurantByIdParams): Promise<ToastApiResponse<DetailedRestaurant>> {
    const { restaurantGUID, restaurantExternalId, includeArchived } = params;
    
    // Build query string
    const searchParams = new URLSearchParams();
    if (includeArchived !== undefined) {
      searchParams.append('includeArchived', includeArchived.toString());
    }

    const queryString = searchParams.toString();
    const url = `/restaurants/v1/restaurants/${restaurantGUID}${queryString ? `?${queryString}` : ''}`;

    return this.httpClient.request<DetailedRestaurant>({
      method: 'GET',
      url,
      headers: {
        'Toast-Restaurant-External-ID': restaurantExternalId,
      },
    });
  }

  /**
   * Get restaurants by management group using dedicated endpoint
   * Uses the /restaurants/v1/groups/{guid}/restaurants endpoint
   * 
   * @param params Parameters including management group GUID and external ID
   * @returns Promise resolving to an array of restaurant references
   */
  async getRestaurantsByManagementGroupId(params: GetRestaurantsByManagementGroupParams): Promise<ToastApiResponse<RestaurantReference[]>> {
    const { managementGroupGUID, restaurantExternalId } = params;

    return this.httpClient.request<RestaurantReference[]>({
      method: 'GET',
      url: `/restaurants/v1/groups/${managementGroupGUID}/restaurants`,
      headers: {
        'Toast-Restaurant-External-ID': restaurantExternalId,
      },
    });
  }

  /**
   * Get detailed information for multiple restaurants by their GUIDs
   * 
   * @param restaurantGuids Array of restaurant GUIDs
   * @param restaurantExternalId Restaurant external ID for headers
   * @param includeArchived Whether to include archived restaurants
   * @returns Promise resolving to an array of detailed restaurant information
   */
  async getMultipleRestaurantsById(
    restaurantGuids: string[],
    restaurantExternalId: string,
    includeArchived: boolean = false
  ): Promise<DetailedRestaurant[]> {
    const restaurants: DetailedRestaurant[] = [];
    
    // Make parallel requests for all restaurant GUIDs
    const promises = restaurantGuids.map(guid => 
      this.getRestaurantById({
        restaurantGUID: guid,
        restaurantExternalId,
        includeArchived,
      })
    );

    try {
      const responses = await Promise.all(promises);
      
      for (const response of responses) {
        if (response.data) {
          restaurants.push(response.data);
        }
      }
    } catch (error) {
      // Re-throw the error to let the caller handle it
      throw error;
    }

    return restaurants;
  }

  /**
   * Get detailed restaurants for a management group
   * Combines the management group endpoint with detailed restaurant calls
   * 
   * @param params Parameters including management group GUID and external ID
   * @param includeArchived Whether to include archived restaurants
   * @returns Promise resolving to an array of detailed restaurant information
   */
  async getDetailedRestaurantsByManagementGroup(
    params: GetRestaurantsByManagementGroupParams,
    includeArchived: boolean = false
  ): Promise<DetailedRestaurant[]> {
    // First get the restaurant references from the management group
    const referencesResponse = await this.getRestaurantsByManagementGroupId(params);
    
    if (!referencesResponse.data || referencesResponse.data.length === 0) {
      return [];
    }

    // Extract GUIDs and get detailed information
    const restaurantGuids = referencesResponse.data.map(ref => ref.guid);
    return this.getMultipleRestaurantsById(
      restaurantGuids,
      params.restaurantExternalId,
      includeArchived
    );
  }
}
