
// This file is meant to be used server-side only
// For browser environments, we need to use an API approach

// Mock implementation for browser usage
const executeQuery = async (text, params) => {
  console.error('Direct database connection is not supported in browsers.');
  console.error('Please implement a backend API for database operations.');
  throw new Error('Database operations cannot run directly in browser environments');
};

// Export a mock implementation
export {
  executeQuery
};
