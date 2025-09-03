import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ToastClientConfig, ToastApiResponse, RequestConfig, ToastApiError } from '../types';

/**
 * HTTP client wrapper for Toast API requests
 */
export class HttpClient {
  private axiosInstance: AxiosInstance;
  private token: string;

  constructor(config: ToastClientConfig) {
    this.token = config.token;
    
    this.axiosInstance = axios.create({
      baseURL: config.host || 'https://toast-api-server',
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.axiosInstance.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response && error.response.status >= 400) {
          const responseData = error.response.data as any;
          const toastError: ToastApiError = {
            message: responseData?.message || error.message || 'An error occurred',
            code: responseData?.code || error.code,
            details: responseData,
          };
          
          const errorResponse: ToastApiResponse = {
            data: null,
            error: toastError,
            status: error.response.status,
            statusText: error.response.statusText,
          };
          
          throw new Error(`Toast API Error (${error.response.status}): ${toastError.message}`);
        }
        throw error;
      }
    );
  }

  /**
   * Make an HTTP request to the Toast API
   */
  async request<T = any>(config: RequestConfig): Promise<ToastApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.request({
        method: config.method,
        url: config.url,
        data: config.data,
        params: config.params,
        headers: config.headers,
      });

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      // Re-throw the error as it's already been processed by the interceptor
      throw error;
    }
  }

  /**
   * Make a GET request
   */
  async get<T = any>(url: string, params?: Record<string, any>): Promise<ToastApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
    });
  }

  /**
   * Make a POST request
   */
  async post<T = any>(url: string, data?: any): Promise<ToastApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
    });
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(url: string, data?: any): Promise<ToastApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
    });
  }

  /**
   * Make a PATCH request
   */
  async patch<T = any>(url: string, data?: any): Promise<ToastApiResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
    });
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(url: string): Promise<ToastApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
    });
  }
}
