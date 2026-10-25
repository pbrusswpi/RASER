//Centralizes domain validation.
// This prevents every Boundary/Control from independently implementing validation rules.

export function requireNonBlank(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${fieldName} is required.`);
  return normalized;
}

export function requirePositiveInteger(value: number, fieldName: string): number {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${fieldName} must be a positive integer.`);
  }
  return value;
}

export function requireThresholds(low: number, high: number): void {
  if (!Number.isFinite(low) || !Number.isFinite(high) || low < 0 || high < 0) {
    throw new Error("Quality thresholds must be non-negative numbers.");
  }
  if (low >= high) throw new Error("Low quality threshold must be lower than high quality threshold.");
}

export function requireSixDigitPin(pin: string): string {
  const normalized = pin.trim();
  if (!/^\d{6}$/.test(normalized)) throw new Error("PIN must contain exactly six digits.");
  return normalized;
}

export function requireFutureDate(value: string, fieldName: string): string {
  if (!value || Number.isNaN(Date.parse(value))) throw new Error(`${fieldName} must be a valid date.`);
  if (Date.parse(value) <= Date.now()) throw new Error(`${fieldName} must be in the future.`);
  return value;
}
