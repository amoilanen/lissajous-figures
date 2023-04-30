/**
 * https://en.wikipedia.org/wiki/Euclidean_algorithm
 * 
 * @param x 
 * @param y 
 * @returns 
 */
export function gcd(x: number, y: number): number {
  let a = x
  let b = y
  let r = a % b
  while (r > 0) {
    a = b
    b = r
    r = a % b
  }
  return b
}