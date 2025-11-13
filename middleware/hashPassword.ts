import { hashPassword } from '@/helpers/passwordUtils';

/**
 * Middleware to hash a password
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPasswordMiddleware(password: string): Promise<string> {
  return await hashPassword(password);
}