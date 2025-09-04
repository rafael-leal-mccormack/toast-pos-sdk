# Real Integration Tests

This directory contains real integration tests that make actual API calls to the Toast servers.

## 🧪 Real Integration Tests

### `real-integration-tests.js`

These tests verify that the SDK works correctly with the actual Toast API by making real HTTP requests.

**⚠️ Important**: These tests require valid Toast API credentials and will make actual API calls.

#### Required Environment Variables

Create a `.env` file in the `demo/` directory with the following variables:

```bash
# Toast API Host URL
TOAST_HOST=https://toast-api-server

# Toast API Authentication Credentials  
TOAST_USER_CLIENT_ID=your_client_id_here
TOAST_CLIENT_SECRET=your_client_secret_here

# Optional: Direct access token (if you have one)
TOAST_USER_ACCESS_TOKEN=your_access_token_here
```

#### Running the Tests

```bash
# Run real integration tests
npm run test:real

# Or run directly
node demo/tests/real-integration-tests.js
```

#### What These Tests Do

1. **Authentication Test**: Verifies that `getToastToken()` works with real credentials
2. **Client Creation**: Tests creating a `ToastClient` with a real token
3. **Restaurants API**: Fetches all restaurants from the real API
4. **Date Filtering**: Tests restaurant filtering by modification date
5. **Active Restaurants**: Verifies filtering for non-deleted restaurants
6. **Error Handling**: Tests error handling with invalid endpoints
7. **Configuration**: Verifies client configuration is correct

#### Expected Output

```
🧪 Running Real Toast API Integration Tests

⚠️  These tests make actual API calls to Toast servers

   📝 Making authentication request...
   ✅ Got token: eyJhbGciOiJSUzI1NiIs...
✅ Should get authentication token from Toast API
   ✅ Client created with host: https://toast-api-server
✅ Should create client with real authentication token
   📝 Fetching all restaurants...
   ✅ Retrieved 5 restaurants
   📍 First restaurant: Main Street Cafe
   📍 Location: 123 Main Street
   📍 GUID: e728cd53-2fa7-4e63-8f8f-93e78ea66b03
   📍 Management Group: bdfda703-2a83-4e0f-9b8a-8ea0ee6cab79
✅ Should get all restaurants from real Toast API
...

📊 Test Results: 7 passed, 0 failed
🎉 All real integration tests passed!
```

#### Troubleshooting

**Missing Environment Variables**
```
❌ Missing required environment variables:
   - TOAST_CLIENT_SECRET
   - TOAST_USER_CLIENT_ID
   - TOAST_HOST

Please create a .env file with these variables and try again.
```

**Authentication Errors**
- Verify your `TOAST_USER_CLIENT_ID` and `TOAST_CLIENT_SECRET` are correct
- Check that your `TOAST_HOST` is accessible
- Ensure your API credentials have the necessary permissions

**API Errors**
- Check your network connection
- Verify the Toast API is available
- Check your API rate limits

## 🔒 Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Use the `demo/env.example` file as a template
- Rotate your API credentials regularly

## 📊 Test Coverage

These real integration tests complement the unit tests by verifying:

- ✅ Real API connectivity
- ✅ Authentication flow
- ✅ Data retrieval from actual endpoints
- ✅ Error handling with real responses
- ✅ Client configuration with real tokens
