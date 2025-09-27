import { HttpClient } from '../client/http-client';
import { ToastApiResponse } from '../types';
import { Order, OrdersBulkParams, GetOrderParams, FulfillmentStatus } from '../types/orders';

/**
 * Toast Orders API client
 */
export class OrdersApi {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get orders in bulk with optional filtering parameters
   * 
   * @param params Query parameters and restaurant ID for the request
   * @returns Promise resolving to an array of orders
   */
  async listOrdersBulk(params: OrdersBulkParams): Promise<ToastApiResponse<Order[]>> {
    const { restaurantExternalId, ...queryParams } = params;
    
    // Build query string from parameters
    const searchParams = new URLSearchParams();
    
    if (queryParams.businessDate) {
      searchParams.append('businessDate', queryParams.businessDate);
    }
    if (queryParams.endDate) {
      searchParams.append('endDate', queryParams.endDate);
    }
    if (queryParams.page !== undefined) {
      searchParams.append('page', queryParams.page.toString());
    }
    if (queryParams.pageSize !== undefined) {
      searchParams.append('pageSize', queryParams.pageSize.toString());
    }
    if (queryParams.startDate) {
      searchParams.append('startDate', queryParams.startDate);
    }

    const queryString = searchParams.toString();
    const url = `/orders/v2/ordersBulk${queryString ? `?${queryString}` : ''}`;

    return this.httpClient.request<Order[]>({
      method: 'GET',
      url,
      headers: {
        'Toast-Restaurant-External-ID': restaurantExternalId,
      },
    });
  }

  /**
   * Get a specific order by its GUID
   * 
   * @param params Order GUID and restaurant ID for the request
   * @returns Promise resolving to the order details
   */
  async getOrder(params: GetOrderParams): Promise<ToastApiResponse<Order>> {
    const { guid, restaurantExternalId } = params;

    return this.httpClient.request<Order>({
      method: 'GET',
      url: `/orders/v2/orders/${guid}`,
      headers: {
        'Toast-Restaurant-External-ID': restaurantExternalId,
      },
    });
  }

  /**
   * Convenience method to get orders for a specific date range
   * 
   * @param restaurantExternalId Restaurant external ID
   * @param startDate Start date in ISO format
   * @param endDate End date in ISO format
   * @param options Additional options like page size
   * @returns Promise resolving to an array of orders
   */
  async getOrdersByDateRange(
    restaurantExternalId: string,
    startDate: string,
    endDate: string,
    options: { page?: number; pageSize?: number } = {}
  ): Promise<ToastApiResponse<Order[]>> {
    return this.listOrdersBulk({
      restaurantExternalId,
      startDate,
      endDate,
      ...options,
    });
  }

  /**
   * Convenience method to get orders for a specific business date
   * 
   * @param restaurantExternalId Restaurant external ID
   * @param businessDate Business date in ISO format
   * @param options Additional options like page size
   * @returns Promise resolving to an array of orders
   */
  async getOrdersByBusinessDate(
    restaurantExternalId: string,
    businessDate: string,
    options: { page?: number; pageSize?: number } = {}
  ): Promise<ToastApiResponse<Order[]>> {
    return this.listOrdersBulk({
      restaurantExternalId,
      businessDate,
      ...options,
    });
  }

  /**
   * Get all orders with automatic pagination
   * 
   * @param params Base parameters for the request
   * @param maxPages Maximum number of pages to fetch (default: 10)
   * @returns Promise resolving to all orders across pages
   */
  async getAllOrders(
    params: OrdersBulkParams,
    maxPages: number = 10
  ): Promise<Order[]> {
    const allOrders: Order[] = [];
    let currentPage = params.page || 1;
    const pageSize = 50; // Use a reasonable page size

    while (currentPage < maxPages) {
      try {
        const response = await this.listOrdersBulk({
          ...params,
          page: currentPage,
          pageSize,
        });

        if (!response.data || response.data.length === 0) {
          break; // No more data
        }

        allOrders.push(...response.data);

        // If we got fewer results than the page size, we've reached the end
        if (response.data.length < pageSize) {
          break;
        }

        currentPage++;
      } catch (error) {
        // Re-throw the error to let the caller handle it
        throw error;
      }
    }

    return allOrders;
  }

  /**
   * Get all live orders - orders that are not yet ready or completed
   * Live orders are those with items that have fulfillmentStatus of 'NEW', 'HOLD', or 'SENT'
   *
   * @param params Base parameters for the request
   * @param maxPages Maximum number of pages to fetch (default: 10)
   * @returns Promise resolving to live orders only
   */
  async getLiveOrders(
    params: OrdersBulkParams,
    maxPages: number = 10
  ): Promise<Order[]> {
    const allOrders = await this.getAllOrders(params, maxPages);
    return this.filterLiveOrders(allOrders);
  }

  /**
   * Filter orders to return only "live" orders
   * Live orders are those with at least one item that has fulfillmentStatus of 'NEW', 'HOLD', or 'SENT'
   *
   * @param orders Array of orders to filter
   * @returns Array of live orders
   */
  filterLiveOrders(orders: Order[]): Order[] {
    const liveStatuses: FulfillmentStatus[] = ['NEW', 'HOLD', 'SENT'];

    return orders.filter(order => {
      if (!order.checks || order.checks.length === 0) {
        return false;
      }

      return order.checks.some(check => {
        if (!check.selections || check.selections.length === 0) {
          return false;
        }

        return check.selections.some(selection => {
          return selection.fulfillmentStatus && liveStatuses.includes(selection.fulfillmentStatus);
        });
      });
    });
  }
}
