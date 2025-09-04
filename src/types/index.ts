/**
 * Configuration options for the Toast client
 */
export interface ToastClientConfig {
  /** The base URL for the Toast API (defaults to https://toast-api-server) */
  host?: string;
  /** Authentication token for API requests */
  token: string;
  /** Request timeout in milliseconds (defaults to 30000) */
  timeout?: number;
}

/**
 * Standard API response wrapper
 */
export interface ToastApiResponse<T = any> {
  data?: T;
  error?: ToastApiError;
  status: number;
  statusText: string;
}

/**
 * Error structure for Toast API responses
 */
export interface ToastApiError {
  message: string;
  code?: string;
  details?: any;
}

/**
 * HTTP methods supported by the client
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Request configuration for HTTP calls
 */
export interface RequestConfig {
  method: HttpMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

// Re-export all order types
export * from './orders';

// Re-export all restaurant types
export * from './restaurants';
