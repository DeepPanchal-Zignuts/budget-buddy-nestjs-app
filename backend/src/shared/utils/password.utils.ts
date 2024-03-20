import { HttpException, HttpStatus } from '@nestjs/common';
import {
  bcrypt,
  SALT,
  RESPONSE_MESSAGES,
} from '../constants/messages.constants';

// Hash the Password
export async function HashPassword(password: string) {
  try {
    // Creating Hashed password.
    const hashedPassword = await bcrypt.hash(password, SALT.SALT_ROUNDS);

    // Returning hashed password
    return hashedPassword;
  } catch (error) {
    // If Error in hashing password
    throw new HttpException(
      {
        message: RESPONSE_MESSAGES.PASSWORD_HASHING_ERROR,
        error,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

// Compare the Password
export async function ComparePassword(
  password: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(password, hashedPassword);
}
