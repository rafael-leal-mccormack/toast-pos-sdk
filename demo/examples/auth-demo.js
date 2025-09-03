// Authentication demonstration for Toast SDK
const { ToastAuth, getToastToken } = require('../../dist/index.js');

async function authDemo() {
  console.log('🔐 Toast SDK - Authentication Demo\n');

  // Note: These are mock examples since we don't have real Toast API credentials
  console.log('📝 Note: This demo uses mock credentials for demonstration purposes');
  console.log('   In real usage, replace with your actual Toast API credentials\n');

  // Example 1: Using ToastAuth class
  console.log('1. Using ToastAuth class...');
  try {
    const auth = new ToastAuth({
      host: 'https://mock-toast-api.com',
      clientId: 'your-client-id',
      clientSecret: 'your-client-secret',
    });

    console.log('✅ ToastAuth instance created successfully');
    console.log('   This would normally make a request to get an access token');
    console.log('   Mock token would be returned: "mock-access-token-12345"');
    
    // Uncomment the line below to actually attempt token retrieval
    // const token = await auth.getAccessToken();
    // console.log('   Retrieved token:', token);
    
  } catch (error) {
    console.error('❌ ToastAuth error:', error.message);
  }

  // Example 2: Using convenience function
  console.log('\n2. Using getToastToken convenience function...');
  try {
    console.log('✅ Convenience function ready to use');
    console.log('   This would make the same request as ToastAuth class');
    console.log('   Usage: await getToastToken({ clientId, clientSecret, ... })');
    
    // Uncomment the lines below to actually attempt token retrieval
    /*
    const token = await getToastToken({
      host: 'https://your-toast-api.com',
      clientId: 'your-client-id',
      clientSecret: 'your-client-secret',
    });
    console.log('   Retrieved token:', token);
    */
    
  } catch (error) {
    console.error('❌ getToastToken error:', error.message);
  }

  // Example 3: Configuration options
  console.log('\n3. Available authentication configuration options...');
  const exampleConfig = {
    host: 'https://toast-api-server',           // Optional: API host URL
    clientId: 'your-client-id',                // Required: Your Toast client ID
    clientSecret: 'your-client-secret',        // Required: Your Toast client secret
  };

  console.log('✅ Example configuration:');
  console.log(JSON.stringify(exampleConfig, null, 2));

  // Example 4: Error scenarios
  console.log('\n4. Demonstrating error handling...');
  try {
    const auth = new ToastAuth({
      clientId: '',  // Invalid: empty client ID
      clientSecret: 'some-secret',
    });
    
    // This would fail in real usage
    console.log('❌ This configuration would fail in real usage (empty clientId)');
    
  } catch (error) {
    console.log('✅ Error handling: Configuration validation working');
    console.log('   Error:', error.message);
  }

  console.log('\n💡 Integration example:');
  console.log(`
// Real-world usage:
const token = await getToastToken({
  clientId: process.env.TOAST_CLIENT_ID,
  clientSecret: process.env.TOAST_CLIENT_SECRET,
});

const client = new ToastClient(token);
// Now you can make authenticated API calls
`);

  console.log('\n✨ Authentication demo completed!\n');
}

// Run the demo
if (require.main === module) {
  authDemo().catch(console.error);
}

module.exports = { authDemo };
