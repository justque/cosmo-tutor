export function isValidPin(pin: string): boolean {
  return /^[0-9]{4}$/.test(pin)
}
