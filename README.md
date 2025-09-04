# Toast SDK

[![npm version](https://badge.fury.io/js/toast-pos-sdk.svg)](https://www.npmjs.com/package/toast-pos-sdk)
[![npm downloads](https://img.shields.io/npm/dm/toast-pos-sdk.svg)](https://www.npmjs.com/package/toast-pos-sdk)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/rafael-leal-mccormack/toast-pos-sdk/blob/main/LICENSE)

A Node.js SDK for the Toast POS API.

## Installation

```bash
npm install toast-pos-sdk
```

## Quick Start

### Basic Usage

```typescript
import { ToastClient } from 'toast-pos-sdk';

// Create client with token only (uses default host)
const client = new ToastClient('your-auth-token');

// Or create client with custom host and token
const client = new ToastClient('https://your-toast-api-host', 'your-auth-token');

// Or create client with configuration object
const client = new ToastClient({
  host: 'https://your-toast-api-host',
  token: 'your-auth-token',
  timeout: 30000, // optional, defaults to 30000ms
});
```

### Getting an Authentication Token

```typescript
import { getToastToken } from 'toast-pos-sdk';

const token = await getToastToken({
  host: 'https://your-toast-api-host', // optional
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
});

const client = new ToastClient(token);
```

### Making Custom API Calls

```typescript
// Access the HTTP client directly for custom requests
const response = await client.http.get('/some-endpoint');
const data = await client.http.post('/some-endpoint', { key: 'value' });

// Handle responses
if (response.data) {
  console.log('Success:', response.data);
} else if (response.error) {
  console.error('Error:', response.error.message);
}
```

## Error Handling

The SDK automatically throws errors for HTTP status codes >= 400:

```typescript
try {
  const response = await client.http.get('/some-endpoint');
  console.log(response.data);
} catch (error) {
  console.error('API Error:', error.message);
  // Error message will be in format: "Toast API Error (400): Error message"
}
```

## Configuration

### Client Configuration

- `host` (string, optional): Base URL for the Toast API. Defaults to `https://toast-api-server`
- `token` (string, required): Authentication token for API requests
- `timeout` (number, optional): Request timeout in milliseconds. Defaults to 30000

### Authentication Configuration

- `host` (string, optional): Base URL for the Toast API
- `clientId` (string, required): Your Toast API client ID
- `clientSecret` (string, required): Your Toast API client secret

## API Methods

### Orders API

The SDK provides comprehensive access to Toast's Orders API:

```typescript
import { ToastClient } from 'toast-pos-sdk';

const client = new ToastClient(host, token);

// List orders in bulk with filtering
const orders = await client.orders.listOrdersBulk({
  restaurantExternalId: 'your-restaurant-id',
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  page: 0,
  pageSize: 100,
});

// Get a specific order by ID
const order = await client.orders.getOrder({
  guid: 'order-guid-here',
  restaurantExternalId: 'your-restaurant-id',
});

// Convenience methods
const todaysOrders = await client.orders.getOrdersByBusinessDate(
  'your-restaurant-id',
  '2024-01-15',
  { pageSize: 50 }
);

const weekOrders = await client.orders.getOrdersByDateRange(
  'your-restaurant-id',
  '2024-01-01',
  '2024-01-07'
);

// Get all orders with automatic pagination
const allOrders = await client.orders.getAllOrders({
  restaurantExternalId: 'your-restaurant-id',
  startDate: '2024-01-01',
  endDate: '2024-01-02',
}, 5); // Max 5 pages
```

#### Available Order Data

Each order contains comprehensive information:
- Order metadata (ID, dates, status, source)
- Customer information (name, phone, email)
- Order items and selections with modifiers
- Payments and refund details
- Applied discounts and service charges
- Delivery and curbside pickup information
- Tax details and marketplace facilitator info
- Device and employee information

#### TypeScript Support

All order-related types are fully typed and exportable:

```typescript
import { Order, OrderCustomer, Payment, Selection } from 'toast-pos-sdk';

// Use the types in your application
function processOrder(order: Order) {
  const customer: OrderCustomer = order.checks?.[0]?.customer;
  const payments: Payment[] = order.checks?.[0]?.payments || [];
  const items: Selection[] = order.checks?.[0]?.selections || [];
  
  // Process order data with full type safety
}
```

### Restaurants API

Access restaurant information and management:

```typescript
import { ToastClient, Restaurant } from 'toast-pos-sdk';

const client = new ToastClient(host, token);

// Get all restaurants
const restaurants = await client.restaurants.getAllRestaurants();

// Get restaurants modified since a date
const recentRestaurants = await client.restaurants.getRestaurantsModifiedSince('2024-01-01');

// Find restaurants by name
const matchingRestaurants = await client.restaurants.findRestaurantsByName('Main Street');

// Get a specific restaurant by GUID
const restaurant = await client.restaurants.getRestaurantByGuid('restaurant-guid-here');

// Get only active (non-deleted) restaurants
const activeRestaurants = await client.restaurants.getActiveRestaurants();

// Get restaurants by management group
const groupRestaurants = await client.restaurants.getRestaurantsByManagementGroup('group-guid');

// Get detailed restaurant information by GUID
const detailedRestaurant = await client.restaurants.getRestaurantById({
  restaurantGUID: 'restaurant-guid-here',
  restaurantExternalId: 'external-id-here',
  includeArchived: false,
});

// Get restaurants by management group (dedicated endpoint)
const groupRefs = await client.restaurants.getRestaurantsByManagementGroupId({
  managementGroupGUID: 'group-guid-here',
  restaurantExternalId: 'external-id-here',
});

// Get detailed restaurants for a management group
const detailedGroupRestaurants = await client.restaurants.getDetailedRestaurantsByManagementGroup({
  managementGroupGUID: 'group-guid-here',
  restaurantExternalId: 'external-id-here',
}, false); // includeArchived
```

#### Available Restaurant Data

**Basic Restaurant Info** (from `/partners/v1/restaurants`):
- Restaurant GUID (for use in other API calls)
- Restaurant name and location information
- Management group GUID
- Creation and modification timestamps
- Deletion status
- External reference IDs
- Creator email address

**Detailed Restaurant Info** (from `/restaurants/v1/restaurants/{guid}`):
- Complete location details (address, phone, coordinates)
- Operating schedules and hours for each service
- Delivery configuration and minimum order amounts
- Online ordering settings and payment options
- Prep times and throttling settings
- Social media URLs (website, Facebook, Twitter)
- Time zone and currency information
- Archive status and business dates

#### Integration with Orders API

Restaurant GUIDs can be used directly with the Orders API:

```typescript
// Get all active restaurants with detailed information
const restaurants = await client.restaurants.getActiveRestaurants();

// Get detailed info and orders for each restaurant
for (const restaurant of restaurants) {
  // Get detailed restaurant information
  const detailedInfo = await client.restaurants.getRestaurantById({
    restaurantGUID: restaurant.restaurantGuid,
    restaurantExternalId: restaurant.restaurantGuid,
    includeArchived: false,
  });
  
  // Get orders for this restaurant
  const orders = await client.orders.getOrdersByBusinessDate(
    restaurant.restaurantGuid, // Use as restaurantExternalId
    new Date().toISOString().split('T')[0]
  );
  
  if (detailedInfo.data) {
    console.log(`${detailedInfo.data.general.name}: ${orders.data?.length || 0} orders`);
    console.log(`  Location: ${detailedInfo.data.location.address1}, ${detailedInfo.data.location.city}`);
    console.log(`  Phone: ${detailedInfo.data.location.phone}`);
    console.log(`  Delivery: ${detailedInfo.data.delivery.enabled ? 'Yes' : 'No'}`);
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Build the SDK
npm run build

# Watch for changes during development
npm run dev

# Clean build directory
npm run clean
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
