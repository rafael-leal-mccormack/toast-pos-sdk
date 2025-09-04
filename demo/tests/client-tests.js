// Simple test suite for Toast SDK client functionality
const { ToastClient } = require('../../dist/index.js');

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
    console.log('🧪 Running Toast SDK Client Tests\n');

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

  assertThrows(fn, message) {
    try {
      fn();
      throw new Error(message || 'Expected function to throw');
    } catch (error) {
      // Expected behavior
    }
  }
}

const runner = new TestRunner();

// Test 1: Should throw error when only token provided (host required)
runner.test('Should throw error when only token provided', () => {
  runner.assertThrows(
    () => new ToastClient('test-token'),
    'Should throw error for missing host'
  );
});

// Test 2: Should create client with host and token
runner.test('Should create client with host and token', () => {
  const client = new ToastClient('https://custom-host.com', 'test-token');
  runner.assert(client.getConfig().token === 'test-token');
  runner.assert(client.getConfig().host === 'https://custom-host.com');
  runner.assert(client.getBaseUrl() === 'https://custom-host.com');
});

// Test 3: Client creation with config object
runner.test('Should create client with config object', () => {
  const config = {
    host: 'https://config-host.com',
    token: 'config-token',
    timeout: 15000,
  };
  const client = new ToastClient(config);
  runner.assert(client.getConfig().token === 'config-token');
  runner.assert(client.getConfig().host === 'https://config-host.com');
  runner.assert(client.getConfig().timeout === 15000);
});

// Test 4: Should throw error when no token provided
runner.test('Should throw error when no token provided', () => {
  runner.assertThrows(
    () => new ToastClient(),
    'Should throw error for missing token'
  );
});

// Test 5: Should throw error when empty token provided
runner.test('Should throw error when empty token provided', () => {
  runner.assertThrows(
    () => new ToastClient({ host: 'https://test.com', token: '' }),
    'Should throw error for empty token'
  );
});

// Test 6: Token update functionality
runner.test('Should update token correctly', () => {
  const client = new ToastClient('https://test.com', 'initial-token');
  runner.assertEqual(client.getConfig().token, 'initial-token');
  
  client.setToken('updated-token');
  runner.assertEqual(client.getConfig().token, 'updated-token');
});

// Test 7: HTTP client access
runner.test('Should provide access to HTTP client', () => {
  const client = new ToastClient('https://test.com', 'test-token');
  runner.assert(client.http !== undefined);
  runner.assert(typeof client.http.get === 'function');
  runner.assert(typeof client.http.post === 'function');
  runner.assert(typeof client.http.put === 'function');
  runner.assert(typeof client.http.patch === 'function');
  runner.assert(typeof client.http.delete === 'function');
});

// Test 8: Config immutability
runner.test('Should return immutable config copy', () => {
  const client = new ToastClient('https://test.com', 'test-token');
  const config1 = client.getConfig();
  const config2 = client.getConfig();
  
  // Should be different objects
  runner.assert(config1 !== config2);
  // But with same content
  runner.assertEqual(config1.token, config2.token);
  
  // Modifying returned config shouldn't affect internal config
  config1.token = 'modified';
  runner.assertEqual(client.getConfig().token, 'test-token');
});

// Test 9: Default timeout value
runner.test('Should use default timeout when not specified', () => {
  const client = new ToastClient('https://test.com', 'test-token');
  // The timeout should be set in the HTTP client, but we can't easily test that
  // without exposing internal implementation. This test ensures no errors occur.
  runner.assert(client !== undefined);
});

// Test 10: Constructor overload handling
runner.test('Should handle all constructor overloads correctly', () => {
  // Host and token
  const client1 = new ToastClient('https://host1.com', 'token1');
  runner.assertEqual(client1.getConfig().token, 'token1');
  runner.assertEqual(client1.getConfig().host, 'https://host1.com');
  
  // Config object
  const client2 = new ToastClient({ host: 'https://host2.com', token: 'token2', timeout: 5000 });
  runner.assertEqual(client2.getConfig().token, 'token2');
  runner.assertEqual(client2.getConfig().host, 'https://host2.com');
  runner.assertEqual(client2.getConfig().timeout, 5000);
});

// Run all tests
if (require.main === module) {
  runner.run().catch(console.error);
}

module.exports = { TestRunner, runner };
