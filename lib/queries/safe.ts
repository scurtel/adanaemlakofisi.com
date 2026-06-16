export function isPrismaMissingTableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.message.includes("P2021") || error.message.includes("does not exist");
}

export function logSafeQueryError(scope: string, error: unknown): void {
  console.error(`[safe-query:${scope}]`, error);
}
