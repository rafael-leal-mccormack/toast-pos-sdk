// Run all demo examples
const { basicUsageExamples } = require('./basic-usage');
const { httpClientDemo } = require('./http-client-demo');
const { authDemo } = require('./auth-demo');
const { ordersDemo } = require('./orders-demo');
const { restaurantsDemo } = require('./restaurants-demo');

async function runAllDemos() {
  console.log('🚀 Running all Toast SDK demos...\n');
  console.log('=' .repeat(60));

  try {
    await basicUsageExamples();
    console.log('=' .repeat(60));
    
    await httpClientDemo();
    console.log('=' .repeat(60));
    
    await authDemo();
    console.log('=' .repeat(60));
    
    await ordersDemo();
    console.log('=' .repeat(60));
    
    await restaurantsDemo();
    console.log('=' .repeat(60));
    
    console.log('🎉 All demos completed successfully!');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    process.exit(1);
  }
}

// Run all demos if this file is executed directly
if (require.main === module) {
  runAllDemos().catch(console.error);
}

module.exports = { runAllDemos };
