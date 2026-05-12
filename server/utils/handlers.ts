/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export function ErrorHandler(error: Error, message: string, data?: any) {
  console.error(error);
  return {
    status: 'error',
    error: error.message,
    message: message || 'An unexpected error occurred. Please try again later.',
    data: data || null,
  };
}

export function SuccessHandler(message: string, data?: any) {
  return {
    status: 'success',
    ok: true,
    message: message,
    data: data || null,
  };
}
