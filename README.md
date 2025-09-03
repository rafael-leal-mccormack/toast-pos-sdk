# Toast SDK

A Node.js SDK for the Toast POS API.

## Installation

```bash
npm install @rafael/toast-sdk
```

## Quick Start

### Basic Usage

```typescript
import { ToastClient } from '@rafael/toast-sdk';

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
import { getToastToken } from '@rafael/toast-sdk';

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

*API-specific methods will be added as the SDK is extended with Toast API endpoints.*

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
