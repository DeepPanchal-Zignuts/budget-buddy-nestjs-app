export const RESPONSE_MESSAGES = {
  // User Messages
  REGISTRATION_ERROR: 'Error in Registration!',
  REGISTRATION_SUCCESS: 'User Registered Successfully',
  VALIDATION_ERROR: 'Error in Validation',
  INVALID_CREDENTIALS: 'Invalid Email or Password!',
  USER_NOT_FOUND: 'User Not Found',
  LOGIN_SUCCESS: 'User Login Successfully',
  LOGIN_ERROR: 'Error in Login',
  AUTH_ERROR: 'Error in User Authentication',
  PASSWORD_HASHING_ERROR: 'Error in Hashing Password',

  // Account Messages
  ACCOUNT_CREATING_ERROR: 'Error in Creating Account!',
  ACCOUNT_CREATE_SUCCESS: 'Account Created Successfully',
  ACCOUNT_FETCHING_ERROR: 'Error in Retrieving Accounts',
  NO_ACCOUNTS_FOUND: 'No Accounts Found!',
  ACCOUNT_FETCH_SUCCESS: 'All Accounts Retrieved!',
  ACCOUNT_UPDATE_ERROR: 'Error in Updating the Account',
  ACCOUNT_UPDATE_SUCCESS: 'Account Updated Successfully',
  ACCOUNT_DELETING_ERROR: 'Error in Deleting Account',
  ACCOUNT_NOT_FOUND: 'Account Not Found',
  ACCOUNT_DELETE_SUCCESS: 'Account Deleted Successfully',

  // Expense Messages
  EXPENSE_ADDED_SUCCESS: 'Expense Added Successfully!',
  EXPENSE_ADDING_ERROR: 'Error in Adding Expense!',
  EXPENSE_LISTING_ERROR: 'Error in Fetching Expenses',
  NO_EXPENSE_FOUND: 'No Expense Found!',
  EXPENSE_FETCHED_SUCCESS: 'All Expenses Retrieved!',
  EXPENSE_UPDATING_ERROR: 'Error Updating Expense',
  EXPENSE_UPDATING_SUCCESS: 'Expense Updated Successfully',
  EXPENSE_DELETE_SUCCESS: 'Expense Deleted Successfully',
  EXPENSE_DELETE_ERROR: 'Error in Deleting Expense',
  EXPENSE_NOT_FOUND: 'Expense Not Found',
};

// Success Responses
export const SUCCESS_RESPONSE = {
  SUCCESS_TRUE: true,
  SUCCESS_FALSE: false,
};

// Salt Rounds
export const SALT = {
  SALT_ROUNDS: 10,
};

// Pagination
export const PAGINATION = {
  PAGE_SIZE: 7,
};

// HTTP Status Codes
export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Imports
export * as bcrypt from 'bcrypt';
export * as JWT from 'jsonwebtoken';
export { HashPassword, ComparePassword } from '../utils/password.utils';
