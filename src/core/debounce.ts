/* eslint-disable @typescript-eslint/no-explicit-any */
type Procedure = (...args: any[]) => void

export function debounce<F extends Procedure>(fn: F, delay = 500) {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: Parameters<F>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
