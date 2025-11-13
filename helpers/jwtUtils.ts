import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

/**
 * Generate a JWT token
 * @param payload - Data to be stored in the token
 * @param expiresIn - Token expiration time (e.g., '1d', '24h', '30m')
 * @returns Generated JWT token
 */
export function generateToken(payload: any, expiresIn: string = '24h'): string {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  } catch (error: any) {
    throw new Error(`Error generating token: ${error.message}`);
  }
}

/**
 * Verify a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error: any) {
    throw new Error(`Error verifying token: ${error.message}`);
  }
}