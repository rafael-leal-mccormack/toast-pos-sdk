// Tests for Restaurants API functionality
const { ToastClient, RestaurantsApi } = require('../../dist/index.js');

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('🏪 Running Toast SDK Restaurants API Tests\n');

    for (const { name, fn } of this.tests) {
      try {
        await fn();
        console.log(`✅ ${name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${name}`);
        console.log(`   Error: ${error.message}`);
        this.failed++;
      }
    }

    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
    
    if (this.failed > 0) {
      process.exit(1);
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }

  assertNotEqual(actual, expected, message) {
    if (actual === expected) {
      throw new Error(message || `Expected ${actual} to not equal ${expected}`);
    }
  }
}

const runner = new TestRunner();

// Test 1: RestaurantsApi can be instantiated independently
runner.test('Should create RestaurantsApi instance independently', () => {
  const client = new ToastClient('test-token');
  const restaurantsApi = new RestaurantsApi(client.http);
  runner.assert(restaurantsApi !== undefined);
  runner.assert(typeof restaurantsApi.listRestaurants === 'function');
  runner.assert(typeof restaurantsApi.getAllRestaurants === 'function');
});

// Test 2: ToastClient should have restaurants property
runner.test('Should provide access to restaurants API through client', () => {
  const client = new ToastClient('test-token');
  runner.assert(client.restaurants !== undefined);
  runner.assert(typeof client.restaurants.listRestaurants === 'function');
  runner.assert(typeof client.restaurants.getAllRestaurants === 'function');
});

// Test 3: Restaurants API methods should exist
runner.test('Should have all expected restaurants API methods', () => {
  const client = new ToastClient('test-token');
  const restaurants = client.restaurants;
  
  // Core methods
  runner.assert(typeof restaurants.listRestaurants === 'function');
  runner.assert(typeof restaurants.getAllRestaurants === 'function');
  
  // Convenience methods
  runner.assert(typeof restaurants.getRestaurantsModifiedSince === 'function');
  runner.assert(typeof restaurants.findRestaurantsByName === 'function');
  runner.assert(typeof restaurants.getRestaurantByGuid === 'function');
  runner.assert(typeof restaurants.getActiveRestaurants === 'function');
  runner.assert(typeof restaurants.getRestaurantsByManagementGroup === 'function');
});

// Test 4: listRestaurants should build correct query parameters
runner.test('Should build correct query parameters for listRestaurants', async () => {
  const client = new ToastClient({
    host: 'https://httpbin.org', // Using httpbin for testing
    token: 'test-token',
  });
  
  try {
    // This will fail but we can test that the URL was constructed correctly
    await client.restaurants.listRestaurants({
      lastModified: '2024-01-01',
    });
  } catch (error) {
    // Expected to fail, but this tests that the method doesn't crash on parameter building
    runner.assert(error.message.includes('404') || error.message.includes('400') || error.message.includes('Toast API Error'));
  }
});

// Test 5: getAllRestaurants should work (convenience method)
runner.test('Should provide working convenience method getAllRestaurants', async () => {
  const client = new ToastClient('test-token');
  
  // Mock the listRestaurants method to test the convenience wrapper
  const originalMethod = client.restaurants.listRestaurants;
  let calledWithParams = null;
  
  client.restaurants.listRestaurants = async (params = {}) => {
    calledWithParams = params;
    return { data: [], status: 200, statusText: 'OK' };
  };
  
  await client.restaurants.getAllRestaurants();
  
  // Verify the convenience method called listRestaurants with empty params
  runner.assert(calledWithParams !== null);
  runner.assertEqual(Object.keys(calledWithParams).length, 0);
  
  // Restore original method
  client.restaurants.listRestaurants = originalMethod;
});

// Test 6: getRestaurantsModifiedSince should work
runner.test('Should provide working convenience method getRestaurantsModifiedSince', async () => {
  const client = new ToastClient('test-token');
  
  // Mock the listRestaurants method
  const originalMethod = client.restaurants.listRestaurants;
  let calledWithParams = null;
  
  client.restaurants.listRestaurants = async (params = {}) => {
    calledWithParams = params;
    return { data: [], status: 200, statusText: 'OK' };
  };
  
  await client.restaurants.getRestaurantsModifiedSince('2024-01-01');
  
  // Verify the convenience method called listRestaurants with correct parameters
  runner.assert(calledWithParams !== null);
  runner.assertEqual(calledWithParams.lastModified, '2024-01-01');
  
  // Restore original method
  client.restaurants.listRestaurants = originalMethod;
});

// Test 7: findRestaurantsByName should filter correctly
runner.test('Should filter restaurants by name correctly', async () => {
  const client = new ToastClient('test-token');
  
  // Mock the listRestaurants method with sample data
  const originalMethod = client.restaurants.listRestaurants;
  const mockRestaurants = [
    { restaurantName: 'Main Street Cafe', restaurantGuid: 'guid1' },
    { restaurantName: 'Downtown Diner', restaurantGuid: 'guid2' },
    { restaurantName: 'Main Avenue Bistro', restaurantGuid: 'guid3' },
  ];
  
  client.restaurants.listRestaurants = async () => {
    return { data: mockRestaurants, status: 200, statusText: 'OK' };
  };
  
  const results = await client.restaurants.findRestaurantsByName('Main');
  
  // Should find 2 restaurants with "Main" in the name
  runner.assertEqual(results.length, 2);
  runner.assertEqual(results[0].restaurantName, 'Main Street Cafe');
  runner.assertEqual(results[1].restaurantName, 'Main Avenue Bistro');
  
  // Test case insensitive search
  const lowerResults = await client.restaurants.findRestaurantsByName('main');
  runner.assertEqual(lowerResults.length, 2);
  
  // Restore original method
  client.restaurants.listRestaurants = originalMethod;
});

// Test 8: getRestaurantByGuid should find correct restaurant
runner.test('Should find restaurant by GUID correctly', async () => {
  const client = new ToastClient('test-token');
  
  // Mock the listRestaurants method with sample data
  const originalMethod = client.restaurants.listRestaurants;
  const mockRestaurants = [
    { restaurantName: 'Cafe 1', restaurantGuid: 'guid-1' },
    { restaurantName: 'Cafe 2', restaurantGuid: 'guid-2' },
    { restaurantName: 'Cafe 3', restaurantGuid: 'guid-3' },
  ];
  
  client.restaurants.listRestaurants = async () => {
    return { data: mockRestaurants, status: 200, statusText: 'OK' };
  };
  
  const foundRestaurant = await client.restaurants.getRestaurantByGuid('guid-2');
  
  // Should find the correct restaurant
  runner.assert(foundRestaurant !== null);
  runner.assertEqual(foundRestaurant.restaurantName, 'Cafe 2');
  runner.assertEqual(foundRestaurant.restaurantGuid, 'guid-2');
  
  // Test not found case
  const notFound = await client.restaurants.getRestaurantByGuid('nonexistent-guid');
  runner.assertEqual(notFound, null);
  
  // Restore original method
  client.restaurants.listRestaurants = originalMethod;
});

// Test 9: getActiveRestaurants should filter deleted restaurants
runner.test('Should filter out deleted restaurants correctly', async () => {
  const client = new ToastClient('test-token');
  
  // Mock the listRestaurants method with sample data
  const originalMethod = client.restaurants.listRestaurants;
  const mockRestaurants = [
    { restaurantName: 'Active Cafe', restaurantGuid: 'guid-1', deleted: false },
    { restaurantName: 'Deleted Cafe', restaurantGuid: 'guid-2', deleted: true },
    { restaurantName: 'Another Active', restaurantGuid: 'guid-3', deleted: false },
  ];
  
  client.restaurants.listRestaurants = async () => {
    return { data: mockRestaurants, status: 200, statusText: 'OK' };
  };
  
  const activeRestaurants = await client.restaurants.getActiveRestaurants();
  
  // Should find only 2 active restaurants
  runner.assertEqual(activeRestaurants.length, 2);
  runner.assertEqual(activeRestaurants[0].restaurantName, 'Active Cafe');
  runner.assertEqual(activeRestaurants[1].restaurantName, 'Another Active');
  
  // Verify none are deleted
  activeRestaurants.forEach(restaurant => {
    runner.assertEqual(restaurant.deleted, false);
  });
  
  // Restore original method
  client.restaurants.listRestaurants = originalMethod;
});

// Test 10: getRestaurantsByManagementGroup should filter correctly
runner.test('Should filter restaurants by management group correctly', async () => {
  const client = new ToastClient('test-token');
  
  // Mock the listRestaurants method with sample data
  const originalMethod = client.restaurants.listRestaurants;
  const mockRestaurants = [
    { restaurantName: 'Cafe A', managementGroupGuid: 'group-1' },
    { restaurantName: 'Cafe B', managementGroupGuid: 'group-2' },
    { restaurantName: 'Cafe C', managementGroupGuid: 'group-1' },
  ];
  
  client.restaurants.listRestaurants = async () => {
    return { data: mockRestaurants, status: 200, statusText: 'OK' };
  };
  
  const group1Restaurants = await client.restaurants.getRestaurantsByManagementGroup('group-1');
  
  // Should find 2 restaurants in group-1
  runner.assertEqual(group1Restaurants.length, 2);
  runner.assertEqual(group1Restaurants[0].restaurantName, 'Cafe A');
  runner.assertEqual(group1Restaurants[1].restaurantName, 'Cafe C');
  
  // Verify all are in the correct group
  group1Restaurants.forEach(restaurant => {
    runner.assertEqual(restaurant.managementGroupGuid, 'group-1');
  });
  
  // Restore original method
  client.restaurants.listRestaurants = originalMethod;
});

// Test 11: Restaurants API should be reinitialized when token is updated
runner.test('Should reinitialize restaurants API when token is updated', () => {
  const client = new ToastClient('initial-token');
  const originalRestaurantsApi = client.restaurants;
  
  client.setToken('updated-token');
  
  // The restaurants API should be a new instance
  runner.assertNotEqual(client.restaurants, originalRestaurantsApi);
  runner.assert(typeof client.restaurants.listRestaurants === 'function');
});

// Test 12: Should have new detailed restaurant API methods
runner.test('Should have new detailed restaurant API methods', () => {
  const client = new ToastClient('test-token');
  const restaurants = client.restaurants;
  
  // Check for new detailed methods
  runner.assert(typeof restaurants.getRestaurantById === 'function');
  runner.assert(typeof restaurants.getRestaurantsByManagementGroupId === 'function');
  runner.assert(typeof restaurants.getMultipleRestaurantsById === 'function');
  runner.assert(typeof restaurants.getDetailedRestaurantsByManagementGroup === 'function');
});

// Test 13: Should build correct parameters for getRestaurantById
runner.test('Should build correct parameters for getRestaurantById', async () => {
  const client = new ToastClient({
    host: 'https://httpbin.org',
    token: 'test-token',
  });
  
  try {
    await client.restaurants.getRestaurantById({
      restaurantGUID: 'test-guid-123',
      restaurantExternalId: 'test-external-id',
      includeArchived: true,
    });
  } catch (error) {
    // Expected to fail, but this tests that the method doesn't crash on parameter building
    runner.assert(error.message.includes('404') || error.message.includes('400') || error.message.includes('Toast API Error'));
  }
});

// Test 14: Should build correct parameters for getRestaurantsByManagementGroupId
runner.test('Should build correct parameters for getRestaurantsByManagementGroupId', async () => {
  const client = new ToastClient({
    host: 'https://httpbin.org',
    token: 'test-token',
  });
  
  try {
    await client.restaurants.getRestaurantsByManagementGroupId({
      managementGroupGUID: 'test-group-guid',
      restaurantExternalId: 'test-external-id',
    });
  } catch (error) {
    // Expected to fail, but this tests that the method doesn't crash on parameter building
    runner.assert(error.message.includes('404') || error.message.includes('400') || error.message.includes('Toast API Error'));
  }
});

// Test 15: Should handle empty response data gracefully
runner.test('Should handle empty response data gracefully', async () => {
  const client = new ToastClient('test-token');
  
  // Mock the listRestaurants method to return null data
  const originalMethod = client.restaurants.listRestaurants;
  
  client.restaurants.listRestaurants = async () => {
    return { data: null, status: 200, statusText: 'OK' };
  };
  
  // These should not throw errors and should return empty arrays or null
  const searchResults = await client.restaurants.findRestaurantsByName('test');
  runner.assertEqual(searchResults.length, 0);
  
  const guidResult = await client.restaurants.getRestaurantByGuid('test-guid');
  runner.assertEqual(guidResult, null);
  
  const activeResults = await client.restaurants.getActiveRestaurants();
  runner.assertEqual(activeResults.length, 0);
  
  const groupResults = await client.restaurants.getRestaurantsByManagementGroup('test-group');
  runner.assertEqual(groupResults.length, 0);
  
  // Restore original method
  client.restaurants.listRestaurants = originalMethod;
});

// Run all tests
if (require.main === module) {
  runner.run().catch(console.error);
}

module.exports = { runner };
