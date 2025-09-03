// HTTP Client demonstration for Toast SDK
const { ToastClient } = require('../../dist/index.js');

async function httpClientDemo() {
  console.log('🌐 Toast SDK - HTTP Client Demo\n');

  // Create a client for demonstration
  const client = new ToastClient({
    host: 'https://jsonplaceholder.typicode.com', // Using a test API for demo
    token: 'demo-token-12345',
    timeout: 10000,
  });

  console.log('Client configured with test API endpoint for demonstration');
  console.log('Base URL:', client.getBaseUrl());

  // Example 1: GET request
  console.log('\n1. Making a GET request...');
  try {
    const response = await client.http.get('/posts/1');
    console.log('✅ GET request successful');
    console.log('   Status:', response.status);
    console.log('   Data preview:', JSON.stringify(response.data, null, 2).substring(0, 200) + '...');
  } catch (error) {
    console.error('❌ GET request failed:', error.message);
  }

  // Example 2: POST request
  console.log('\n2. Making a POST request...');
  try {
    const postData = {
      title: 'Test Post from Toast SDK',
      body: 'This is a test post created using the Toast SDK HTTP client.',
      userId: 1,
    };
    
    const response = await client.http.post('/posts', postData);
    console.log('✅ POST request successful');
    console.log('   Status:', response.status);
    console.log('   Created resource ID:', response.data?.id);
    console.log('   Response data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ POST request failed:', error.message);
  }

  // Example 3: PUT request
  console.log('\n3. Making a PUT request...');
  try {
    const updateData = {
      id: 1,
      title: 'Updated Post Title',
      body: 'This post has been updated using the Toast SDK.',
      userId: 1,
    };
    
    const response = await client.http.put('/posts/1', updateData);
    console.log('✅ PUT request successful');
    console.log('   Status:', response.status);
    console.log('   Updated data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ PUT request failed:', error.message);
  }

  // Example 4: Error handling demonstration
  console.log('\n4. Demonstrating error handling (404 error)...');
  try {
    const response = await client.http.get('/posts/999999');
    console.log('This should not print - request should fail');
  } catch (error) {
    console.log('✅ Error handling working correctly');
    console.log('   Error message:', error.message);
  }

  // Example 5: Using query parameters
  console.log('\n5. Making GET request with query parameters...');
  try {
    const response = await client.http.get('/posts', { 
      userId: 1,
      _limit: 3 
    });
    console.log('✅ GET with params successful');
    console.log('   Status:', response.status);
    console.log('   Number of posts returned:', response.data?.length);
    console.log('   First post title:', response.data?.[0]?.title);
  } catch (error) {
    console.error('❌ GET with params failed:', error.message);
  }

  console.log('\n✨ HTTP Client demo completed!\n');
}

// Run the demo
if (require.main === module) {
  httpClientDemo().catch(console.error);
}

module.exports = { httpClientDemo };
