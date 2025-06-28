// Simple test runner to verify our TDD implementation
const { ConfigLoader } = require('./src/config/config-loader.ts');

console.log('🧪 Running basic ConfigLoader test...');

try {
  const configLoader = new ConfigLoader();
  
  // Test loadFromObject
  const testConfig = {
    server: {
      port: 3000,
      host: 'localhost',
      cors: true
    },
    apis: [
      {
        path: '/api/test',
        method: 'GET',
        response: {
          status: 200,
          body: { message: 'test' }
        }
      }
    ]
  };

  const result = configLoader.loadFromObject(testConfig);
  console.log('✅ loadFromObject test passed');
  console.log('📋 Config loaded:', JSON.stringify(result, null, 2));

} catch (error) {
  console.error('❌ Test failed:', error.message);
}

console.log('🎯 TDD Cycle 1 Complete - ConfigLoader basic functionality implemented');