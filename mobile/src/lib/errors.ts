import { isAxiosError } from 'axios';

// Normalize failures once so screens can display a useful message without casting errors.
export function getErrorMessage(error: unknown, fallback = ''): string {
  if (isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (message) return message;
  }
  return error instanceof Error ? error.message || fallback : fallback;
}

export function getErrorCode(error: unknown): string | undefined {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    return error.code;
  }
}
