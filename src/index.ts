// Main exports
export { ToastClient } from './client/toast-client';
export { HttpClient } from './client/http-client';

// Authentication utilities
export { ToastAuth, getToastToken } from './utils/auth';

// Type definitions
export type {
  ToastClientConfig,
  ToastApiResponse,
  ToastApiError,
  HttpMethod,
  RequestConfig,
} from './types';

export type {
  AuthConfig,
  TokenResponse,
} from './utils/auth';

// Default export for convenience
export { ToastClient as default } from './client/toast-client';
