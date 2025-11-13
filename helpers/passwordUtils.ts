import bcrypt from 'bcryptjs';

/**
 * Hash a password
 * @param password - The plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error: any) {
    throw new Error(`Error hashing password: ${error.message}`);
  }
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password to compare against
 * @returns Boolean indicating if passwords match
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error: any) {
    throw new Error(`Error comparing passwords: ${error.message}`);
  }
}