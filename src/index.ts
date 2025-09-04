// Main exports
export { ToastClient } from './client/toast-client';
export { HttpClient } from './client/http-client';

// API clients
export { OrdersApi } from './api/orders';
export { RestaurantsApi } from './api/restaurants';

// Authentication utilities
export { ToastAuth, getToastToken } from './utils/auth';

// Type definitions
export * from './types';

export type {
  AuthConfig,
  TokenResponse,
} from './utils/auth';

// Default export for convenience
export { ToastClient as default } from './client/toast-client';
