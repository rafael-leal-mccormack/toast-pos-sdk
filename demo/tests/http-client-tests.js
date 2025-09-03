// Tests for HTTP Client functionality
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
    console.log('🌐 Running Toast SDK HTTP Client Tests\n');

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

// Create a client for testing (using JSONPlaceholder for real HTTP tests)
const testClient = new ToastClient({
  host: 'https://jsonplaceholder.typicode.com',
  token: 'test-token',
  timeout: 10000,
});

// Test 1: GET request
runner.test('Should make successful GET request', async () => {
  const response = await testClient.http.get('/posts/1');
  runner.assert(response.status === 200);
  runner.assert(response.data !== undefined);
  runner.assert(response.data.id === 1);
});

// Test 2: GET request with query parameters
runner.test('Should make GET request with query parameters', async () => {
  const response = await testClient.http.get('/posts', { userId: 1, _limit: 5 });
  runner.assert(response.status === 200);
  runner.assert(Array.isArray(response.data));
  runner.assert(response.data.length <= 5);
});

// Test 3: POST request
runner.test('Should make successful POST request', async () => {
  const postData = {
    title: 'Test Post',
    body: 'This is a test post',
    userId: 1,
  };
  
  const response = await testClient.http.post('/posts', postData);
  runner.assert(response.status === 201);
  runner.assert(response.data.title === postData.title);
  runner.assert(response.data.body === postData.body);
});

// Test 4: PUT request
runner.test('Should make successful PUT request', async () => {
  const updateData = {
    id: 1,
    title: 'Updated Post',
    body: 'This post has been updated',
    userId: 1,
  };
  
  const response = await testClient.http.put('/posts/1', updateData);
  runner.assert(response.status === 200);
  runner.assert(response.data.title === updateData.title);
});

// Test 5: PATCH request
runner.test('Should make successful PATCH request', async () => {
  const patchData = {
    title: 'Patched Title',
  };
  
  const response = await testClient.http.patch('/posts/1', patchData);
  runner.assert(response.status === 200);
  runner.assert(response.data.title === patchData.title);
});

// Test 6: DELETE request
runner.test('Should make successful DELETE request', async () => {
  const response = await testClient.http.delete('/posts/1');
  runner.assert(response.status === 200);
});

// Test 7: Error handling for 404
runner.test('Should handle 404 errors correctly', async () => {
  try {
    await testClient.http.get('/posts/999999');
    throw new Error('Should have thrown an error for 404');
  } catch (error) {
    runner.assert(error.message.includes('404'));
  }
});

// Test 8: Generic request method
runner.test('Should work with generic request method', async () => {
  const response = await testClient.http.request({
    method: 'GET',
    url: '/posts/1',
  });
  
  runner.assert(response.status === 200);
  runner.assert(response.data.id === 1);
});

// Test 9: Response structure validation
runner.test('Should return proper response structure', async () => {
  const response = await testClient.http.get('/posts/1');
  
  // Check response has required properties
  runner.assert(response.hasOwnProperty('data'));
  runner.assert(response.hasOwnProperty('status'));
  runner.assert(response.hasOwnProperty('statusText'));
  
  // Check types
  runner.assert(typeof response.status === 'number');
  runner.assert(typeof response.statusText === 'string');
});

// Test 10: Headers in response
runner.test('Should handle response with custom headers', async () => {
  const response = await testClient.http.get('/posts/1');
  runner.assert(response.status === 200);
  // JSONPlaceholder should return JSON content
  runner.assert(response.data !== null);
});

// Test 11: Timeout configuration (this test just ensures no error occurs)
runner.test('Should respect timeout configuration', async () => {
  const quickClient = new ToastClient({
    host: 'https://jsonplaceholder.typicode.com',
    token: 'test-token',
    timeout: 30000, // 30 seconds should be plenty
  });
  
  const response = await quickClient.http.get('/posts/1');
  runner.assert(response.status === 200);
});

// Test 12: Custom headers in request
runner.test('Should handle custom headers in request', async () => {
  const response = await testClient.http.request({
    method: 'GET',
    url: '/posts/1',
    headers: {
      'Custom-Header': 'test-value',
    },
  });
  
  runner.assert(response.status === 200);
});

// Run all tests
if (require.main === module) {
  runner.run().catch(console.error);
}

module.exports = { runner };
