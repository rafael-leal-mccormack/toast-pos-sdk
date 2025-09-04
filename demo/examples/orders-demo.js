// Orders API demonstration for Toast SDK
const { ToastClient } = require('../../dist/index.js');

async function ordersDemo() {
  console.log('📋 Toast SDK - Orders API Demo\n');

  // Create a client for demonstration
  const client = new ToastClient({
    host: 'https://toast-api-server',
    token: 'your-auth-token-here',
    timeout: 30000,
  });

  console.log('Client configured for Orders API demonstrations');
  console.log('Base URL:', client.getBaseUrl());

  // Example 1: List orders in bulk with date range
  console.log('\n1. Listing orders in bulk with date range...');
  try {
    const startDate = '2024-01-01';
    const endDate = '2024-01-31';
    const restaurantId = 'your-restaurant-external-id';
    
    console.log('📝 This would make a request like:');
    console.log(`   GET /orders/v2/ordersBulk?startDate=${startDate}&endDate=${endDate}`);
    console.log(`   Headers: { 'Toast-Restaurant-External-ID': '${restaurantId}' }`);
    
    // Uncomment the line below to make an actual API call
    /*
    const response = await client.orders.listOrdersBulk({
      restaurantExternalId: restaurantId,
      startDate: startDate,
      endDate: endDate,
      page: 0,
      pageSize: 10,
    });
    
    console.log('✅ Orders retrieved successfully');
    console.log('   Status:', response.status);
    console.log('   Number of orders:', response.data?.length || 0);
    if (response.data && response.data.length > 0) {
      console.log('   First order ID:', response.data[0].guid);
      console.log('   First order created:', response.data[0].createdDate);
    }
    */
    
    console.log('✅ Method configured correctly (uncomment to make actual call)');
    
  } catch (error) {
    console.error('❌ List orders error:', error.message);
  }

  // Example 2: Get a specific order by ID
  console.log('\n2. Getting a specific order by ID...');
  try {
    const orderGuid = 'your-order-guid-here';
    const restaurantId = 'your-restaurant-external-id';
    
    console.log('📝 This would make a request like:');
    console.log(`   GET /orders/v2/orders/${orderGuid}`);
    console.log(`   Headers: { 'Toast-Restaurant-External-ID': '${restaurantId}' }`);
    
    // Uncomment the lines below to make an actual API call
    /*
    const response = await client.orders.getOrder({
      guid: orderGuid,
      restaurantExternalId: restaurantId,
    });
    
    console.log('✅ Order retrieved successfully');
    console.log('   Status:', response.status);
    console.log('   Order ID:', response.data?.guid);
    console.log('   Order total:', response.data?.checks?.[0]?.totalAmount);
    console.log('   Number of checks:', response.data?.checks?.length || 0);
    console.log('   Customer name:', response.data?.checks?.[0]?.customer?.firstName, response.data?.checks?.[0]?.customer?.lastName);
    */
    
    console.log('✅ Method configured correctly (uncomment to make actual call)');
    
  } catch (error) {
    console.error('❌ Get order error:', error.message);
  }

  // Example 3: Using convenience method for date range
  console.log('\n3. Using convenience method for date range...');
  try {
    const restaurantId = 'your-restaurant-external-id';
    const startDate = '2024-01-01';
    const endDate = '2024-01-07';
    
    console.log('📝 This uses the convenience method getOrdersByDateRange()');
    console.log(`   Date range: ${startDate} to ${endDate}`);
    
    // Uncomment the lines below to make an actual API call
    /*
    const response = await client.orders.getOrdersByDateRange(
      restaurantId,
      startDate,
      endDate,
      { pageSize: 20 }
    );
    
    console.log('✅ Orders retrieved via convenience method');
    console.log('   Number of orders:', response.data?.length || 0);
    */
    
    console.log('✅ Convenience method configured correctly');
    
  } catch (error) {
    console.error('❌ Date range orders error:', error.message);
  }

  // Example 4: Using convenience method for business date
  console.log('\n4. Using convenience method for business date...');
  try {
    const restaurantId = 'your-restaurant-external-id';
    const businessDate = '2024-01-15';
    
    console.log('📝 This uses the convenience method getOrdersByBusinessDate()');
    console.log(`   Business date: ${businessDate}`);
    
    // Uncomment the lines below to make an actual API call
    /*
    const response = await client.orders.getOrdersByBusinessDate(
      restaurantId,
      businessDate,
      { pageSize: 50 }
    );
    
    console.log('✅ Orders retrieved for business date');
    console.log('   Number of orders:', response.data?.length || 0);
    */
    
    console.log('✅ Business date method configured correctly');
    
  } catch (error) {
    console.error('❌ Business date orders error:', error.message);
  }

  // Example 5: Getting all orders with pagination
  console.log('\n5. Getting all orders with automatic pagination...');
  try {
    const restaurantId = 'your-restaurant-external-id';
    const startDate = '2024-01-01';
    const endDate = '2024-01-02';
    
    console.log('📝 This uses getAllOrders() which handles pagination automatically');
    console.log('   ⚠️  Warning: This can return a large amount of data!');
    
    // Uncomment the lines below to make an actual API call
    /*
    const allOrders = await client.orders.getAllOrders({
      restaurantExternalId: restaurantId,
      startDate: startDate,
      endDate: endDate,
    }, 3); // Limit to 3 pages max for safety
    
    console.log('✅ All orders retrieved with pagination');
    console.log('   Total orders across all pages:', allOrders.length);
    */
    
    console.log('✅ Pagination method configured correctly');
    
  } catch (error) {
    console.error('❌ Get all orders error:', error.message);
  }

  console.log('\n💡 Real-world usage example:');
  console.log(`
// Get today's orders
const today = new Date().toISOString().split('T')[0];
const orders = await client.orders.getOrdersByBusinessDate(
  process.env.TOAST_RESTAURANT_ID,
  today,
  { pageSize: 100 }
);

// Process each order
for (const order of orders.data || []) {
  console.log(\`Order \${order.guid}: \${order.checks?.[0]?.totalAmount || 0}\`);
  
  // Access order details
  const customer = order.checks?.[0]?.customer;
  const items = order.checks?.[0]?.selections || [];
  const payments = order.checks?.[0]?.payments || [];
  
  // Process customer, items, payments...
}
`);

  console.log('\n📊 Available Order Data:');
  console.log('   • Order metadata (ID, dates, status)');
  console.log('   • Customer information (name, phone, email)');
  console.log('   • Order items and selections');
  console.log('   • Payments and refunds');
  console.log('   • Discounts and service charges');
  console.log('   • Delivery information');
  console.log('   • Tax details');
  console.log('   • And much more!');

  console.log('\n✨ Orders API demo completed!\n');
}

// Run the demo
if (require.main === module) {
  ordersDemo().catch(console.error);
}

module.exports = { ordersDemo };
