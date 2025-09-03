import { ToastClientConfig } from '../types';
import { HttpClient } from './http-client';

/**
 * Main Toast POS API client
 */
export class ToastClient {
  private httpClient: HttpClient;
  private config: ToastClientConfig;

  constructor(host: string, token: string);
  constructor(token: string);
  constructor(config: ToastClientConfig);
  constructor(hostOrTokenOrConfig?: string | ToastClientConfig, token?: string) {
    // Handle different constructor signatures
    if (typeof hostOrTokenOrConfig === 'string') {
      if (token) {
        // ToastClient(host, token)
        this.config = {
          host: hostOrTokenOrConfig,
          token,
        };
      } else {
        // ToastClient(token)
        this.config = {
          token: hostOrTokenOrConfig,
        };
      }
    } else if (hostOrTokenOrConfig) {
      // ToastClient(config)
      this.config = hostOrTokenOrConfig;
    } else {
      // No arguments provided
      throw new Error('Authentication token is required. Use ToastClient(token) or ToastClient(host, token) or ToastClient(config)');
    }

    // Validate required token
    if (!this.config.token) {
      throw new Error('Authentication token is required');
    }

    // Initialize HTTP client
    this.httpClient = new HttpClient(this.config);
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
    return this.config.host || 'https://toast-api-server';
  }

  /**
   * Update the authentication token
   */
  setToken(token: string): void {
    this.config.token = token;
    // Reinitialize HTTP client with new token
    this.httpClient = new HttpClient(this.config);
  }

  /**
   * Access to the underlying HTTP client for custom requests
   */
  get http(): HttpClient {
    return this.httpClient;
  }

  // Future API methods will be added here
  // For example:
  // get orders() { return new OrdersApi(this.httpClient); }
  // get menu() { return new MenuApi(this.httpClient); }
  // get customers() { return new CustomersApi(this.httpClient); }
}
