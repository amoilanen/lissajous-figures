export function numberValidation(value: string): boolean | string {
  if (/[\d𝝅\.]+/.test(value))
    return true
  else
    return "Should be a number"
}