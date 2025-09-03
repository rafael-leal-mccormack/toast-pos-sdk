# Toast SDK Demo & Testing

This folder contains demonstration examples and tests for the Toast SDK. These files are not included in the published npm package.

## 📁 Structure

```
demo/
├── examples/          # Usage examples and demonstrations
│   ├── basic-usage.js       # Basic client creation and configuration
│   ├── http-client-demo.js  # HTTP client functionality demo
│   ├── auth-demo.js         # Authentication examples
│   └── all-demos.js         # Run all demos together
├── tests/             # Test files for SDK functionality
│   ├── client-tests.js      # Tests for ToastClient class
│   ├── http-client-tests.js # Tests for HTTP client functionality
│   └── all-tests.js         # Run all tests together
└── README.md          # This file
```

## 🚀 Running Examples

### Individual Examples

```bash
# Basic usage examples
node demo/examples/basic-usage.js

# HTTP client demonstration
node demo/examples/http-client-demo.js

# Authentication examples
node demo/examples/auth-demo.js
```

### All Examples

```bash
# Run all examples together
node demo/examples/all-demos.js
```

## 🧪 Running Tests

### Individual Test Suites

```bash
# Test ToastClient functionality
node demo/tests/client-tests.js

# Test HTTP client functionality
node demo/tests/http-client-tests.js
```

### All Tests

```bash
# Run all test suites
node demo/tests/all-tests.js
```

## 📝 What Each Example Shows

### `basic-usage.js`
- Creating clients with different constructor patterns
- Configuration options
- Token management
- Error handling for invalid configurations

### `http-client-demo.js`
- Making HTTP requests (GET, POST, PUT, PATCH, DELETE)
- Using query parameters
- Error handling for HTTP errors
- Response structure and data access

### `auth-demo.js`
- Using the ToastAuth class
- Using the getToastToken convenience function
- Configuration options for authentication
- Integration patterns with the main client

## 🔧 Test Coverage

### `client-tests.js`
- Constructor overloads and parameter validation
- Configuration management
- Token updates
- Error scenarios
- Immutability of returned configurations

### `http-client-tests.js`
- HTTP method implementations
- Request/response handling
- Error handling for different status codes
- Query parameters and custom headers
- Response structure validation

## 📋 Prerequisites

Before running examples or tests, make sure you have:

1. **Built the SDK**: Run `npm run build` from the project root
2. **Installed dependencies**: Run `npm install` from the project root

## 🌐 Live API Testing

The HTTP client tests use JSONPlaceholder (https://jsonplaceholder.typicode.com) as a test API to demonstrate real HTTP functionality. This allows the tests to verify:

- Actual network requests
- Real response handling
- Error scenarios (like 404s)
- Different HTTP methods

## 💡 Usage in Your Projects

These examples show how to integrate the Toast SDK in your own projects:

```javascript
const { ToastClient, getToastToken } = require('@rafael/toast-sdk');

// Get a token (in real usage)
const token = await getToastToken({
  clientId: process.env.TOAST_CLIENT_ID,
  clientSecret: process.env.TOAST_CLIENT_SECRET,
});

// Create client
const client = new ToastClient('https://toast-api-server', token);

// Make API calls
const response = await client.http.get('/some-endpoint');
```

## 🚫 Not Included in Package

This entire `demo/` folder is excluded from the published npm package via the `files` field in `package.json`. This keeps the published package clean while providing comprehensive examples and tests for development.
