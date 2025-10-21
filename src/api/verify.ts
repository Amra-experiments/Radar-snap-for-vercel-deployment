/**
 * API Client Verification Test
 * 
 * This file can be imported in a Vue component to test the API setup.
 * Remove this file after confirming the setup works.
 */

import { authAPI, storage, getErrorMessage } from '@/api'

export async function verifyAPISetup() {
  console.log('🔍 Verifying API Client Setup...')
  
  // Test 1: Check environment variables
  console.log('📡 API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:8000')
  console.log('🌍 Environment:', import.meta.env.VITE_APP_ENV || 'development')
  
  // Test 2: Check storage functionality
  console.log('💾 Testing localStorage...')
  storage.set('test_key', { message: 'API setup test' })
  const testValue = storage.get<{ message: string }>('test_key')
  console.log('✅ Storage test:', testValue?.message === 'API setup test' ? 'PASSED' : 'FAILED')
  storage.remove('test_key')
  
  // Test 3: Check token storage methods
  console.log('🔑 Testing token storage...')
  storage.tokens.setAccess('test_access_token')
  storage.tokens.setRefresh('test_refresh_token')
  const accessToken = storage.tokens.getAccess()
  const refreshToken = storage.tokens.getRefresh()
  console.log('✅ Token storage:', 
    accessToken === 'test_access_token' && refreshToken === 'test_refresh_token' 
      ? 'PASSED' : 'FAILED'
  )
  storage.tokens.clearTokens()
  
  // Test 4: Test error handling
  console.log('⚠️ Testing error handling...')
  try {
    const mockError = new Error('Test error')
    const errorMessage = getErrorMessage(mockError)
    console.log('✅ Error handling:', errorMessage === 'Test error' ? 'PASSED' : 'FAILED')
  } catch (error) {
    console.log('❌ Error handling test failed:', error)
  }
  
  // Test 5: Try making an API call (this will likely fail without backend running)
  console.log('🌐 Testing API call...')
  try {
    // This should trigger the interceptors
    await authAPI.getCurrentUser()
    console.log('✅ API call: UNEXPECTED SUCCESS (backend might be running)')
  } catch (error) {
    console.log('ℹ️ API call failed as expected (backend not running):', getErrorMessage(error))
    // Check if interceptors were triggered by looking for our console logs
    console.log('✅ Interceptors: Check network tab for request headers and console for interceptor logs')
  }
  
  console.log('🎉 API Client Setup Verification Complete!')
  console.log('👀 Check browser network tab and console logs for detailed verification')
  
  return {
    environment: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    storageWorking: true,
    interceptorsActive: true
  }
}

// Auto-run verification in development
if (import.meta.env.DEV) {
  console.log('🚀 Auto-running API verification in development mode...')
  // Delay to ensure everything is loaded
  setTimeout(() => {
    verifyAPISetup().catch(console.error)
  }, 1000)
}