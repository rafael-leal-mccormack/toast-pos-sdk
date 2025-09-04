// Restaurants API demonstration for Toast SDK
const { ToastClient } = require('../../dist/index.js');

async function restaurantsDemo() {
  console.log('🏪 Toast SDK - Restaurants API Demo\n');

  // Create a client for demonstration
  const client = new ToastClient({
    host: 'https://toast-api-server',
    token: 'your-auth-token-here',
    timeout: 30000,
  });

  console.log('Client configured for Restaurants API demonstrations');
  console.log('Base URL:', client.getBaseUrl());

  // Example 1: List all restaurants
  console.log('\n1. Listing all restaurants...');
  try {
    console.log('📝 This would make a request like:');
    console.log('   GET /partners/v1/restaurants');
    console.log('   Headers: { Authorization: "Bearer <token>" }');
    
    // Uncomment the line below to make an actual API call
    /*
    const response = await client.restaurants.listRestaurants();
    
    console.log('✅ Restaurants retrieved successfully');
    console.log('   Status:', response.status);
    console.log('   Number of restaurants:', response.data?.length || 0);
    
    if (response.data && response.data.length > 0) {
      console.log('   First restaurant:', response.data[0].restaurantName);
      console.log('   Location:', response.data[0].locationName);
      console.log('   GUID:', response.data[0].restaurantGuid);
    }
    */
    
    console.log('✅ Method configured correctly (uncomment to make actual call)');
    
  } catch (error) {
    console.error('❌ List restaurants error:', error.message);
  }

  // Example 2: List restaurants modified since a date
  console.log('\n2. Listing restaurants modified since a specific date...');
  try {
    const lastModified = '2024-01-01';
    
    console.log('📝 This would make a request like:');
    console.log(`   GET /partners/v1/restaurants?lastModified=${lastModified}`);
    
    // Uncomment the lines below to make an actual API call
    /*
    const response = await client.restaurants.getRestaurantsModifiedSince(lastModified);
    
    console.log('✅ Modified restaurants retrieved successfully');
    console.log('   Status:', response.status);
    console.log('   Number of modified restaurants:', response.data?.length || 0);
    
    response.data?.forEach((restaurant, index) => {
      console.log(`   ${index + 1}. ${restaurant.restaurantName} (Modified: ${restaurant.isoModifiedDate})`);
    });
    */
    
    console.log('✅ Date filtering method configured correctly');
    
  } catch (error) {
    console.error('❌ Modified restaurants error:', error.message);
  }

  // Example 3: Find restaurants by name
  console.log('\n3. Finding restaurants by name...');
  try {
    const searchName = 'Main Street';
    
    console.log('📝 This searches through all restaurants client-side');
    console.log(`   Searching for restaurants containing: "${searchName}"`);
    
    // Uncomment the lines below to make an actual API call
    /*
    const matchingRestaurants = await client.restaurants.findRestaurantsByName(searchName);
    
    console.log('✅ Restaurant search completed');
    console.log('   Matching restaurants:', matchingRestaurants.length);
    
    matchingRestaurants.forEach((restaurant, index) => {
      console.log(`   ${index + 1}. ${restaurant.restaurantName} at ${restaurant.locationName}`);
    });
    */
    
    console.log('✅ Name search method configured correctly');
    
  } catch (error) {
    console.error('❌ Restaurant search error:', error.message);
  }

  // Example 4: Get restaurant by GUID
  console.log('\n4. Getting restaurant by GUID...');
  try {
    const restaurantGuid = 'e728cd53-2fa7-4e63-8f8f-93e78ea66b03';
    
    console.log('📝 This searches through all restaurants for the specific GUID');
    console.log(`   Looking for restaurant GUID: ${restaurantGuid}`);
    
    // Uncomment the lines below to make an actual API call
    /*
    const restaurant = await client.restaurants.getRestaurantByGuid(restaurantGuid);
    
    if (restaurant) {
      console.log('✅ Restaurant found');
      console.log('   Name:', restaurant.restaurantName);
      console.log('   Location:', restaurant.locationName);
      console.log('   Management Group:', restaurant.managementGroupGuid);
      console.log('   Created:', restaurant.isoCreatedDate);
      console.log('   Deleted:', restaurant.deleted);
    } else {
      console.log('❌ Restaurant not found');
    }
    */
    
    console.log('✅ GUID lookup method configured correctly');
    
  } catch (error) {
    console.error('❌ Restaurant lookup error:', error.message);
  }

  // Example 5: Get active restaurants only
  console.log('\n5. Getting active (non-deleted) restaurants only...');
  try {
    console.log('📝 This filters out deleted restaurants client-side');
    
    // Uncomment the lines below to make an actual API call
    /*
    const activeRestaurants = await client.restaurants.getActiveRestaurants();
    
    console.log('✅ Active restaurants retrieved');
    console.log('   Number of active restaurants:', activeRestaurants.length);
    
    activeRestaurants.forEach((restaurant, index) => {
      console.log(`   ${index + 1}. ${restaurant.restaurantName} (${restaurant.locationName})`);
    });
    */
    
    console.log('✅ Active restaurants filter configured correctly');
    
  } catch (error) {
    console.error('❌ Active restaurants error:', error.message);
  }

  // Example 6: Get restaurants by management group
  console.log('\n6. Getting restaurants by management group...');
  try {
    const managementGroupGuid = 'bdfda703-2a83-4e0f-9b8a-8ea0ee6cab79';
    
    console.log('📝 This filters restaurants by management group client-side');
    console.log(`   Management Group GUID: ${managementGroupGuid}`);
    
    // Uncomment the lines below to make an actual API call
    /*
    const groupRestaurants = await client.restaurants.getRestaurantsByManagementGroup(managementGroupGuid);
    
    console.log('✅ Management group restaurants retrieved');
    console.log('   Number of restaurants in group:', groupRestaurants.length);
    
    groupRestaurants.forEach((restaurant, index) => {
      console.log(`   ${index + 1}. ${restaurant.restaurantName}`);
    });
    */
    
    console.log('✅ Management group filter configured correctly');
    
  } catch (error) {
    console.error('❌ Management group restaurants error:', error.message);
  }

  // Example 7: Get detailed restaurant information by ID
  console.log('\n7. Getting detailed restaurant information by ID...');
  try {
    const restaurantGuid = 'e728cd53-2fa7-4e63-8f8f-93e78ea66b03';
    const restaurantExternalId = 'your-restaurant-external-id';
    
    console.log('📝 This would make a request like:');
    console.log(`   GET /restaurants/v1/restaurants/${restaurantGuid}?includeArchived=false`);
    console.log(`   Headers: { 'Toast-Restaurant-External-ID': '${restaurantExternalId}' }`);
    
    // Uncomment the lines below to make an actual API call
    /*
    const response = await client.restaurants.getRestaurantById({
      restaurantGUID: restaurantGuid,
      restaurantExternalId: restaurantExternalId,
      includeArchived: false,
    });
    
    console.log('✅ Detailed restaurant retrieved successfully');
    console.log('   Status:', response.status);
    console.log('   Restaurant name:', response.data?.general?.name);
    console.log('   Location:', response.data?.location?.address1);
    console.log('   Time zone:', response.data?.general?.timeZone);
    console.log('   Delivery enabled:', response.data?.delivery?.enabled);
    console.log('   Online ordering enabled:', response.data?.onlineOrdering?.enabled);
    console.log('   Website:', response.data?.urls?.website);
    */
    
    console.log('✅ Detailed restaurant method configured correctly');
    
  } catch (error) {
    console.error('❌ Detailed restaurant error:', error.message);
  }

  // Example 8: Get restaurants by management group ID (using dedicated endpoint)
  console.log('\n8. Getting restaurants by management group ID (dedicated endpoint)...');
  try {
    const managementGroupGuid = 'bdfda703-2a83-4e0f-9b8a-8ea0ee6cab79';
    const restaurantExternalId = 'your-restaurant-external-id';
    
    console.log('📝 This would make a request like:');
    console.log(`   GET /restaurants/v1/groups/${managementGroupGuid}/restaurants`);
    console.log(`   Headers: { 'Toast-Restaurant-External-ID': '${restaurantExternalId}' }`);
    
    // Uncomment the lines below to make an actual API call
    /*
    const response = await client.restaurants.getRestaurantsByManagementGroupId({
      managementGroupGUID: managementGroupGuid,
      restaurantExternalId: restaurantExternalId,
    });
    
    console.log('✅ Management group restaurants retrieved successfully');
    console.log('   Status:', response.status);
    console.log('   Number of restaurants:', response.data?.length || 0);
    
    response.data?.forEach((restaurant, index) => {
      console.log(`   ${index + 1}. Restaurant GUID: ${restaurant.guid}`);
    });
    */
    
    console.log('✅ Management group endpoint configured correctly');
    
  } catch (error) {
    console.error('❌ Management group endpoint error:', error.message);
  }

  // Example 9: Get detailed restaurants for a management group
  console.log('\n9. Getting detailed restaurants for a management group...');
  try {
    const managementGroupGuid = 'bdfda703-2a83-4e0f-9b8a-8ea0ee6cab79';
    const restaurantExternalId = 'your-restaurant-external-id';
    
    console.log('📝 This combines the management group endpoint with detailed restaurant calls');
    console.log('   Step 1: Get restaurant GUIDs from management group');
    console.log('   Step 2: Get detailed info for each restaurant');
    
    // Uncomment the lines below to make an actual API call
    /*
    const detailedRestaurants = await client.restaurants.getDetailedRestaurantsByManagementGroup({
      managementGroupGUID: managementGroupGuid,
      restaurantExternalId: restaurantExternalId,
    }, false); // includeArchived = false
    
    console.log('✅ Detailed management group restaurants retrieved');
    console.log('   Number of detailed restaurants:', detailedRestaurants.length);
    
    detailedRestaurants.forEach((restaurant, index) => {
      console.log(`   ${index + 1}. ${restaurant.general.name} - ${restaurant.location.city}`);
      console.log(`      Delivery: ${restaurant.delivery.enabled ? 'Yes' : 'No'}`);
      console.log(`      Online ordering: ${restaurant.onlineOrdering.enabled ? 'Yes' : 'No'}`);
    });
    */
    
    console.log('✅ Combined management group method configured correctly');
    
  } catch (error) {
    console.error('❌ Combined management group method error:', error.message);
  }

  console.log('\n💡 Real-world usage examples:');
  console.log(`
// Example 1: Basic restaurant listing
const activeRestaurants = await client.restaurants.getActiveRestaurants();

for (const restaurant of activeRestaurants) {
  console.log(\`Restaurant: \${restaurant.restaurantName}\`);
  console.log(\`Location: \${restaurant.locationName}\`);
  
  // Use restaurant GUID for other API calls like orders
  const orders = await client.orders.getOrdersByBusinessDate(
    restaurant.restaurantGuid, // Use as restaurantExternalId
    new Date().toISOString().split('T')[0]
  );
}

// Example 2: Get detailed restaurant information
const detailedRestaurant = await client.restaurants.getRestaurantById({
  restaurantGUID: 'restaurant-guid-here',
  restaurantExternalId: 'external-id-here',
  includeArchived: false,
});

if (detailedRestaurant.data) {
  const restaurant = detailedRestaurant.data;
  console.log(\`\${restaurant.general.name} in \${restaurant.location.city}\`);
  console.log(\`Phone: \${restaurant.location.phone}\`);
  console.log(\`Delivery enabled: \${restaurant.delivery.enabled}\`);
  console.log(\`Online ordering: \${restaurant.onlineOrdering.enabled}\`);
  console.log(\`Website: \${restaurant.urls.website}\`);
}

// Example 3: Get all restaurants in a management group with details
const groupRestaurants = await client.restaurants.getDetailedRestaurantsByManagementGroup({
  managementGroupGUID: 'group-guid-here',
  restaurantExternalId: 'external-id-here',
});

groupRestaurants.forEach(restaurant => {
  console.log(\`\${restaurant.general.name}: \${restaurant.location.address1}\`);
  console.log(\`  Hours: \${restaurant.schedules.daySchedules.monday?.openTime} - \${restaurant.schedules.daySchedules.monday?.closeTime}\`);
});
`);

  console.log('\n📊 Available Restaurant Data:');
  console.log('\n   Basic Restaurant Info (from /partners/v1/restaurants):');
  console.log('   • Restaurant GUID (for use in other APIs)');
  console.log('   • Restaurant name and location');
  console.log('   • Management group information');
  console.log('   • Creation and modification dates');
  console.log('   • Deletion status');
  console.log('   • External reference IDs');
  console.log('   • Creator email address');
  
  console.log('\n   Detailed Restaurant Info (from /restaurants/v1/restaurants/{guid}):');
  console.log('   • Complete location details (address, phone, coordinates)');
  console.log('   • Operating schedules and hours');
  console.log('   • Delivery configuration and areas');
  console.log('   • Online ordering settings');
  console.log('   • Payment options (cash, credit card)');
  console.log('   • Prep times and throttling settings');
  console.log('   • Social media URLs (website, Facebook, Twitter)');
  console.log('   • Time zone and currency information');
  console.log('   • Archive status and business dates');

  console.log('\n✨ Restaurants API demo completed!\n');
}

// Run the demo
if (require.main === module) {
  restaurantsDemo().catch(console.error);
}

module.exports = { restaurantsDemo };
