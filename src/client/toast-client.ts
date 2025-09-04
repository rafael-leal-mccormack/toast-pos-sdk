import { ToastClientConfig } from '../types';
import { HttpClient } from './http-client';
import { OrdersApi } from '../api/orders';
import { RestaurantsApi } from '../api/restaurants';

/**
 * Main Toast POS API client
 */
export class ToastClient {
  private httpClient: HttpClient;
  private config: ToastClientConfig;
  private _orders: OrdersApi;
  private _restaurants: RestaurantsApi;

  constructor(host: string, token: string);
  constructor(config: ToastClientConfig);
  constructor(hostOrConfig: string | ToastClientConfig, token?: string) {
    // Handle different constructor signatures
    if (typeof hostOrConfig === 'string') {
      if (token) {
        // ToastClient(host, token)
        this.config = {
          host: hostOrConfig,
          token,
        };
      } else {
        // Invalid: ToastClient(token) - host is required
        throw new Error('Host URL is required. Use ToastClient(host, token) or ToastClient(config)');
      }
    } else if (hostOrConfig) {
      // ToastClient(config)
      this.config = hostOrConfig;
    } else {
      // No arguments provided
      throw new Error('Host URL and authentication token are required. Use ToastClient(host, token) or ToastClient(config)');
    }

    // Validate required fields
    if (!this.config.host) {
      throw new Error('Host URL is required');
    }
    if (!this.config.token) {
      throw new Error('Authentication token is required');
    }

    // Initialize HTTP client
    this.httpClient = new HttpClient(this.config);
    
    // Initialize API clients
    this._orders = new OrdersApi(this.httpClient);
    this._restaurants = new RestaurantsApi(this.httpClient);
  }

  /**
   * Get the current configuration
   */
  getConfig(): Readonly<ToastClientConfig> {
    return { ...this.config };
  }

  /**
   * Get the base URL being used for API calls
   */
  getBaseUrl(): string {
    return this.config.host;
  }

  /**
   * Update the authentication token
   */
  setToken(token: string): void {
    this.config.token = token;
    // Reinitialize HTTP client with new token
    this.httpClient = new HttpClient(this.config);
    // Reinitialize API clients with new HTTP client
    this._orders = new OrdersApi(this.httpClient);
    this._restaurants = new RestaurantsApi(this.httpClient);
  }

  /**
   * Access to the underlying HTTP client for custom requests
   */
  get http(): HttpClient {
    return this.httpClient;
  }

  /**
   * Access to the Orders API
   */
  get orders(): OrdersApi {
    return this._orders;
  }

  /**
   * Access to the Restaurants API
   */
  get restaurants(): RestaurantsApi {
    return this._restaurants;
  }

  // Future API methods will be added here
  // For example:
  // get menu() { return new MenuApi(this.httpClient); }
  // get customers() { return new CustomersApi(this.httpClient); }
}
