
// Base API configuration and utilities
import { executeQuery } from './database';

// Helper function to format date objects from the database
export const formatDate = (dateString: string): Date => {
  return new Date(dateString);
};

// Helper function to handle database errors
export const handleDatabaseError = (error: any, operation: string): never => {
  console.error(`Error during ${operation}:`, error);
  throw new Error(`Database error during ${operation}: ${error.message}`);
};
