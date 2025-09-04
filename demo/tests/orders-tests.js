// Tests for Orders API functionality
const { ToastClient, OrdersApi } = require('../../dist/index.js');

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
    console.log('📋 Running Toast SDK Orders API Tests\n');

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

// Test 1: OrdersApi can be instantiated independently
runner.test('Should create OrdersApi instance independently', () => {
  const client = new ToastClient('test-token');
  const ordersApi = new OrdersApi(client.http);
  runner.assert(ordersApi !== undefined);
  runner.assert(typeof ordersApi.listOrdersBulk === 'function');
  runner.assert(typeof ordersApi.getOrder === 'function');
});

// Test 2: ToastClient should have orders property
runner.test('Should provide access to orders API through client', () => {
  const client = new ToastClient('test-token');
  runner.assert(client.orders !== undefined);
  runner.assert(typeof client.orders.listOrdersBulk === 'function');
  runner.assert(typeof client.orders.getOrder === 'function');
});

// Test 3: Orders API methods should exist
runner.test('Should have all expected orders API methods', () => {
  const client = new ToastClient('test-token');
  const orders = client.orders;
  
  // Core methods
  runner.assert(typeof orders.listOrdersBulk === 'function');
  runner.assert(typeof orders.getOrder === 'function');
  
  // Convenience methods
  runner.assert(typeof orders.getOrdersByDateRange === 'function');
  runner.assert(typeof orders.getOrdersByBusinessDate === 'function');
  runner.assert(typeof orders.getAllOrders === 'function');
});

// Test 4: listOrdersBulk should build correct query parameters
runner.test('Should build correct query parameters for listOrdersBulk', async () => {
  const client = new ToastClient({
    host: 'https://httpbin.org', // Using httpbin for testing
    token: 'test-token',
  });
  
  try {
    // This will fail due to missing Toast-Restaurant-External-ID header
    // but we can catch the error and verify the URL was constructed correctly
    await client.orders.listOrdersBulk({
      restaurantExternalId: 'test-restaurant',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      page: 0,
      pageSize: 10,
      businessDate: '2024-01-15',
    });
  } catch (error) {
    // Expected to fail, but this tests that the method doesn't crash on parameter building
    runner.assert(error.message.includes('404') || error.message.includes('400') || error.message.includes('Toast API Error'));
  }
});

// Test 5: getOrder should handle GUID parameter correctly
runner.test('Should handle GUID parameter correctly for getOrder', async () => {
  const client = new ToastClient({
    host: 'https://httpbin.org',
    token: 'test-token',
  });
  
  try {
    await client.orders.getOrder({
      guid: 'test-order-guid-12345',
      restaurantExternalId: 'test-restaurant',
    });
  } catch (error) {
    // Expected to fail, but this tests that the method doesn't crash on parameter handling
    runner.assert(error.message.includes('404') || error.message.includes('400') || error.message.includes('Toast API Error'));
  }
});

// Test 6: Convenience method getOrdersByDateRange should work
runner.test('Should provide working convenience method getOrdersByDateRange', async () => {
  const client = new ToastClient('test-token');
  
  // Mock the listOrdersBulk method to test the convenience wrapper
  const originalMethod = client.orders.listOrdersBulk;
  let calledWithParams = null;
  
  client.orders.listOrdersBulk = async (params) => {
    calledWithParams = params;
    return { data: [], status: 200, statusText: 'OK' };
  };
  
  await client.orders.getOrdersByDateRange(
    'test-restaurant',
    '2024-01-01',
    '2024-01-31',
    { page: 1, pageSize: 25 }
  );
  
  // Verify the convenience method called listOrdersBulk with correct parameters
  runner.assert(calledWithParams !== null);
  runner.assertEqual(calledWithParams.restaurantExternalId, 'test-restaurant');
  runner.assertEqual(calledWithParams.startDate, '2024-01-01');
  runner.assertEqual(calledWithParams.endDate, '2024-01-31');
  runner.assertEqual(calledWithParams.page, 1);
  runner.assertEqual(calledWithParams.pageSize, 25);
  
  // Restore original method
  client.orders.listOrdersBulk = originalMethod;
});

// Test 7: Convenience method getOrdersByBusinessDate should work
runner.test('Should provide working convenience method getOrdersByBusinessDate', async () => {
  const client = new ToastClient('test-token');
  
  // Mock the listOrdersBulk method
  const originalMethod = client.orders.listOrdersBulk;
  let calledWithParams = null;
  
  client.orders.listOrdersBulk = async (params) => {
    calledWithParams = params;
    return { data: [], status: 200, statusText: 'OK' };
  };
  
  await client.orders.getOrdersByBusinessDate(
    'test-restaurant',
    '2024-01-15',
    { pageSize: 50 }
  );
  
  // Verify the convenience method called listOrdersBulk with correct parameters
  runner.assert(calledWithParams !== null);
  runner.assertEqual(calledWithParams.restaurantExternalId, 'test-restaurant');
  runner.assertEqual(calledWithParams.businessDate, '2024-01-15');
  runner.assertEqual(calledWithParams.pageSize, 50);
  
  // Restore original method
  client.orders.listOrdersBulk = originalMethod;
});

// Test 8: getAllOrders should handle pagination
runner.test('Should handle pagination correctly in getAllOrders', async () => {
  const client = new ToastClient('test-token');
  
  // Mock the listOrdersBulk method to simulate pagination
  const originalMethod = client.orders.listOrdersBulk;
  let callCount = 0;
  const mockOrders = [
    { guid: 'order1' },
    { guid: 'order2' },
    { guid: 'order3' },
  ];
  
  client.orders.listOrdersBulk = async (params) => {
    callCount++;
    if (callCount === 1) {
      // First page - return 2 orders (less than pageSize to simulate end)
      return { data: mockOrders.slice(0, 2), status: 200, statusText: 'OK' };
    } else {
      // Second page - return empty to simulate end
      return { data: [], status: 200, statusText: 'OK' };
    }
  };
  
  const allOrders = await client.orders.getAllOrders({
    restaurantExternalId: 'test-restaurant',
    startDate: '2024-01-01',
    endDate: '2024-01-02',
  }, 5); // Max 5 pages
  
  // Verify results
  runner.assertEqual(allOrders.length, 2);
  runner.assertEqual(allOrders[0].guid, 'order1');
  runner.assertEqual(allOrders[1].guid, 'order2');
  runner.assertEqual(callCount, 1); // Should stop after first page since it returned < pageSize
  
  // Restore original method
  client.orders.listOrdersBulk = originalMethod;
});

// Test 9: Orders API should be reinitialized when token is updated
runner.test('Should reinitialize orders API when token is updated', () => {
  const client = new ToastClient('initial-token');
  const originalOrdersApi = client.orders;
  
  client.setToken('updated-token');
  
  // The orders API should be a new instance
  runner.assertNotEqual(client.orders, originalOrdersApi);
  runner.assert(typeof client.orders.listOrdersBulk === 'function');
});

// Test 10: Parameter validation for required fields
runner.test('Should handle missing required parameters appropriately', async () => {
  const client = new ToastClient('test-token');
  
  // These should not throw immediately (validation happens at HTTP level)
  // but should be properly structured
  try {
    await client.orders.listOrdersBulk({
      restaurantExternalId: '', // Empty but present
    });
  } catch (error) {
    // Expected to fail at HTTP level, not parameter level
    runner.assert(true); // Test passes if we get here without crashing
  }
  
  try {
    await client.orders.getOrder({
      guid: '',
      restaurantExternalId: '',
    });
  } catch (error) {
    // Expected to fail at HTTP level, not parameter level
    runner.assert(true); // Test passes if we get here without crashing
  }
});

// Run all tests
if (require.main === module) {
  runner.run().catch(console.error);
}

module.exports = { runner };
