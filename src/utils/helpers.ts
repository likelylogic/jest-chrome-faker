export function isDefined (value: any) {
  return typeof value !== 'undefined'
}

export function isObject (value: any): boolean {
  return !!value && typeof value === 'object'
}

export function isPlainObject (value: any): boolean {
  return isObject(value) && !Array.isArray(value)
}
