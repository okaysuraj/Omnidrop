// Normalize failures once so screens can display a useful message without casting errors.
export function getErrorMessage(error: unknown, fallback = ''): string {
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
