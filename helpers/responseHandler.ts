interface ApiResponse<T = any> {
  details: any;
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export function success<T>(data: T, message?: string): ApiResponse<T> {
  return {
  data,
  message,
  details: undefined,
  success: true
};
}

export function error(message: string): ApiResponse {
  return {
  success: false,
  error: message,
  details: undefined,
 
};
}