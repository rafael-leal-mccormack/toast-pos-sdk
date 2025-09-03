// Basic usage examples for Toast SDK
const { ToastClient, getToastToken } = require('../../dist/index.js');

async function basicUsageExamples() {
  console.log('🍞 Toast SDK - Basic Usage Examples\n');

  // Example 1: Create client with token only
  console.log('1. Creating client with token only...');
  try {
    const client = new ToastClient('your-auth-token-here');
    console.log('✅ Client created successfully');
    console.log('   Base URL:', client.getBaseUrl());
    console.log('   Config:', client.getConfig());
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Example 2: Create client with custom host and token
  console.log('\n2. Creating client with custom host and token...');
  try {
    const client = new ToastClient('https://custom-toast-api.com', 'your-token');
    console.log('✅ Client created successfully');
    console.log('   Base URL:', client.getBaseUrl());
    console.log('   Config:', client.getConfig());
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Example 3: Create client with full configuration
  console.log('\n3. Creating client with configuration object...');
  try {
    const client = new ToastClient({
      host: 'https://toast-production-api.com',
      token: 'prod-token-12345',
      timeout: 45000, // 45 seconds
    });
    console.log('✅ Client created successfully');
    console.log('   Base URL:', client.getBaseUrl());
    console.log('   Config:', client.getConfig());
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Example 4: Update token after creation
  console.log('\n4. Updating token after client creation...');
  try {
    const client = new ToastClient('initial-token');
    console.log('   Initial token in config:', client.getConfig().token);
    
    client.setToken('updated-token');
    console.log('✅ Token updated successfully');
    console.log('   Updated token in config:', client.getConfig().token);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  console.log('\n✨ Basic usage examples completed!\n');
}

// Run the examples
if (require.main === module) {
  basicUsageExamples().catch(console.error);
}

module.exports = { basicUsageExamples };
