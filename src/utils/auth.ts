import { ToastApiResponse } from '../types';

/**
 * Configuration for obtaining an authentication token
 */
export interface AuthConfig {
  /** The Toast API host URL */
  host?: string;
  /** Client ID for Toast API authentication */
  clientId: string;
  /** Client secret for Toast API authentication */
  clientSecret: string;
}

/**
 * Response structure for token requests
 */
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

/**
 * Utility class for handling Toast API authentication
 */
export class ToastAuth {
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  /**
   * Obtain an access token using Toast API authentication
   */
  async getAccessToken(): Promise<string> {
    const host = this.config.host || 'https://toast-api-server';
    const tokenUrl = `${host}/authentication/v1/authentication/login`;

    const requestBody = {
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
      userAccessType: 'TOAST_MACHINE_CLIENT'
    };

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token request failed (${response.status}): ${errorText}`);
      }

      const tokenData = await response.json() as TokenResponse;
      return tokenData.access_token;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to obtain access token: ${error.message}`);
      }
      throw new Error('Failed to obtain access token: Unknown error');
    }
  }

  /**
   * Create a configured ToastAuth instance
   */
  static create(config: AuthConfig): ToastAuth {
    return new ToastAuth(config);
  }
}

/**
 * Convenience function to quickly get an access token
 * 
 * Try not to call this directly from the client because it will expose your client secret to the browser. Call it from a server.
 */
export async function getToastToken(config: AuthConfig): Promise<string> {
  const auth = new ToastAuth(config);
  return auth.getAccessToken();
}
