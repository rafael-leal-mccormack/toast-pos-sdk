// Run all test suites
const { spawn } = require('child_process');
const path = require('path');

async function runTest(testFile) {
  return new Promise((resolve, reject) => {
    const testPath = path.join(__dirname, testFile);
    const child = spawn('node', [testPath], { stdio: 'inherit' });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Test ${testFile} failed with code ${code}`));
      }
    });
    
    child.on('error', reject);
  });
}

async function runAllTests() {
  console.log('🧪 Running all Toast SDK tests...\n');
  console.log('=' .repeat(60));

  const tests = [
    'client-tests.js',
    'http-client-tests.js',
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n📋 Running ${test}...`);
      await runTest(test);
      console.log(`✅ ${test} passed`);
      passed++;
    } catch (error) {
      console.log(`❌ ${test} failed:`, error.message);
      failed++;
    }
    console.log('=' .repeat(60));
  }

  console.log(`\n🎯 Overall Test Results:`);
  console.log(`   Test suites passed: ${passed}`);
  console.log(`   Test suites failed: ${failed}`);
  console.log(`   Total test suites: ${tests.length}`);

  if (failed > 0) {
    console.log('\n❌ Some tests failed!');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
  }
}

// Run all tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch((error) => {
    console.error('❌ Test runner error:', error.message);
    process.exit(1);
  });
}

module.exports = { runAllTests };
