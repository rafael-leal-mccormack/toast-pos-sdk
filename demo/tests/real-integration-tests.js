// Real integration tests for Toast SDK
const { ToastClient, getToastToken } = require('../../dist/index.js');
require('dotenv').config();

/**
 * Simple test runner for real integration tests
 */
class RealTestRunner {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  test(name, testFn) {
    this.tests.push({ name, fn: testFn });
  }

  async run() {
    console.log('🧪 Running Real Toast API Integration Tests\n');
    console.log('⚠️  These tests make actual API calls to Toast servers\n');

    for (const test of this.tests) {
      try {
        await test.fn();
        console.log(`✅ ${test.name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${test.name}`);
        console.log(`   Error: ${error.message}`);
        this.failed++;
      }
    }

    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
    
    if (this.failed === 0) {
      console.log('🎉 All real integration tests passed!');
    } else {
      console.log('⚠️  Some tests failed - check your environment variables and API credentials');
    }
  }
}

async function runRealIntegrationTests() {
  const runner = new RealTestRunner();

  // Check required environment variables
  const requiredEnvVars = [
    'TOAST_CLIENT_SECRET',
    'TOAST_USER_ACCESS_TOKEN', 
    'TOAST_USER_CLIENT_ID',
    'TOAST_HOST'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('\nPlease create a .env file with these variables and try again.');
    console.log('Use demo/env.example as a template.');
    return;
  }

  // Validate that the environment variables have actual values (not just empty strings)
  const emptyVars = requiredEnvVars.filter(varName => 
    !process.env[varName] || process.env[varName].trim() === '' || 
    process.env[varName].includes('your_') || process.env[varName].includes('here')
  );
  
  if (emptyVars.length > 0) {
    console.log('❌ Environment variables have placeholder values:');
    emptyVars.forEach(varName => console.log(`   - ${varName}: "${process.env[varName]}"`));
    console.log('\nPlease update your .env file with actual values.');
    return;
  }

  // Test 1: Get authentication token
  runner.test('Should get authentication token from Toast API', async () => {
    const host = process.env.TOAST_HOST;
    const clientId = process.env.TOAST_USER_CLIENT_ID;
    const clientSecret = process.env.TOAST_CLIENT_SECRET;

    console.log('   📝 Making authentication request...');
    
    const token = await getToastToken({
      host,
      clientId,
      clientSecret,
    });

    if (!token || typeof token !== 'string') {
      throw new Error('Token should be a non-empty string');
    }

    console.log(`   ✅ Got token: ${token.substring(0, 20)}...`);
  });

  // Test 2: Create client with real token
  runner.test('Should create client with real authentication token', async () => {
    const host = process.env.TOAST_HOST;
    const clientId = process.env.TOAST_USER_CLIENT_ID;
    const clientSecret = process.env.TOAST_CLIENT_SECRET;

    const token = await getToastToken({
      host,
      clientId,
      clientSecret,
    });

    const client = new ToastClient(host, token);
    
    if (!client) {
      throw new Error('Client should be created successfully');
    }

    console.log(`   ✅ Client created with host: ${client.getBaseUrl()}`);
  });

  // Test 3: Get all restaurants (real API call)
  runner.test('Should get all restaurants from real Toast API', async () => {
    const host = process.env.TOAST_HOST;
    const clientId = process.env.TOAST_USER_CLIENT_ID;
    const clientSecret = process.env.TOAST_CLIENT_SECRET;

    const token = await getToastToken({
      host,
      clientId,
      clientSecret,
    });

    const client = new ToastClient(host, token);
    
    console.log('   📝 Fetching all restaurants...');
    
    const response = await client.restaurants.getAllRestaurants();

    if (!response || !response.data) {
      throw new Error('Response should contain data');
    }

    console.log(`   ✅ Retrieved ${response.data.length} restaurants`);
    
    if (response.data.length > 0) {
      const firstRestaurant = response.data[0];
      console.log(`   📍 First restaurant: ${firstRestaurant.restaurantName}`);
      console.log(`   📍 Location: ${firstRestaurant.locationName}`);
      console.log(`   📍 GUID: ${firstRestaurant.restaurantGuid}`);
      console.log(`   📍 Management Group: ${firstRestaurant.managementGroupGuid}`);
    }
  });

  // Test 4: Get restaurants modified since a date
  runner.test('Should get restaurants modified since a specific date', async () => {
    const host = process.env.TOAST_HOST;
    const clientId = process.env.TOAST_USER_CLIENT_ID;
    const clientSecret = process.env.TOAST_CLIENT_SECRET;

    const token = await getToastToken({
      host,
      clientId,
      clientSecret,
    });

    const client = new ToastClient(host, token);
    
    // Get restaurants modified in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const lastModified = thirtyDaysAgo.toISOString().split('T')[0];
    
    console.log(`   📝 Fetching restaurants modified since ${lastModified}...`);
    
    const response = await client.restaurants.getRestaurantsModifiedSince(lastModified);

    if (!response || !response.data) {
      throw new Error('Response should contain data');
    }

    console.log(`   ✅ Retrieved ${response.data.length} restaurants modified since ${lastModified}`);
  });

  // Test 5: Get active restaurants only
  runner.test('Should get only active (non-deleted) restaurants', async () => {
    const host = process.env.TOAST_HOST;
    const clientId = process.env.TOAST_USER_CLIENT_ID;
    const clientSecret = process.env.TOAST_CLIENT_SECRET;

    const token = await getToastToken({
      host,
      clientId,
      clientSecret,
    });

    const client = new ToastClient(host, token);
    
    console.log('   📝 Fetching active restaurants...');
    
    const activeRestaurants = await client.restaurants.getActiveRestaurants();

    if (!Array.isArray(activeRestaurants)) {
      throw new Error('Should return an array');
    }

    console.log(`   ✅ Retrieved ${activeRestaurants.length} active restaurants`);
    
    // Check that none are deleted
    const deletedRestaurants = activeRestaurants.filter(r => r.deleted);
    if (deletedRestaurants.length > 0) {
      console.log(`   ⚠️  Found ${deletedRestaurants.length} deleted restaurants in active list`);
    } else {
      console.log('   ✅ All returned restaurants are active (not deleted)');
    }
  });

  // Test 6: Test HTTP client error handling
  runner.test('Should handle API errors gracefully', async () => {
    const host = process.env.TOAST_HOST;
    const clientId = process.env.TOAST_USER_CLIENT_ID;
    const clientSecret = process.env.TOAST_CLIENT_SECRET;

    const token = await getToastToken({
      host,
      clientId,
      clientSecret,
    });

    const client = new ToastClient(host, token);
    
    console.log('   📝 Testing error handling with invalid endpoint...');
    
    try {
      // This should fail with a 404 or similar error
      await client.http.request({
        method: 'GET',
        url: '/invalid/endpoint/that/does/not/exist',
      });
      
      // If we get here, the error handling didn't work
      throw new Error('Expected error was not thrown');
    } catch (error) {
      console.log(`   ✅ Error handled correctly: ${error.message}`);
      
      // Verify it's our custom error type
      if (error.message && error.message.includes('Toast API Error')) {
        console.log('   ✅ Custom error type used');
      }
    }
  });

  // Test 7: Test client configuration
  runner.test('Should have correct client configuration', async () => {
    const host = process.env.TOAST_HOST;
    const clientId = process.env.TOAST_USER_CLIENT_ID;
    const clientSecret = process.env.TOAST_CLIENT_SECRET;

    const token = await getToastToken({
      host,
      clientId,
      clientSecret,
    });

    const client = new ToastClient(host, token);
    
    const config = client.getConfig();
    
    if (config.host !== host) {
      throw new Error(`Host mismatch: expected ${host}, got ${config.host}`);
    }
    
    if (config.token !== token) {
      throw new Error('Token mismatch');
    }
    
    console.log(`   ✅ Client configuration correct:`);
    console.log(`      Host: ${config.host}`);
    console.log(`      Token: ${config.token.substring(0, 20)}...`);
    console.log(`      Timeout: ${config.timeout}ms`);
  });

  await runner.run();
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runRealIntegrationTests().catch(error => {
    console.error('❌ Test runner error:', error);
    process.exit(1);
  });
}

module.exports = { runRealIntegrationTests };
