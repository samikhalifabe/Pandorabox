// Test script to find where Chrome is being launched
process.env.DOCKER_ENV = 'true';
console.log('Starting test...');

try {
  console.log('1. Testing config/puppeteer import...');
  const puppeteer = require('./backend/config/puppeteer');
  console.log('✓ puppeteer config imported successfully');

  console.log('2. Testing services/whatsapp import...');
  const whatsapp = require('./backend/services/whatsapp');
  console.log('✓ whatsapp service imported successfully');

  console.log('3. Testing controllers/whatsapp import...');
  const whatsappController = require('./backend/controllers/whatsapp');
  console.log('✓ whatsapp controller imported successfully');

  console.log('4. Testing routes/whatsapp import...');
  const whatsappRoutes = require('./backend/routes/whatsapp');
  console.log('✓ whatsapp routes imported successfully');

  console.log('5. Testing routes/index import...');
  const routes = require('./backend/routes');
  console.log('✓ main routes imported successfully');

  console.log('✅ All imports successful - Chrome should not have launched');
} catch (error) {
  console.error('❌ Error during import:', error.message);
  console.error('Stack:', error.stack);
}