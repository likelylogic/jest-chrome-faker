const cloneFn = require('clone')

export function clone (value) {
  return cloneFn(value)
}

export function isDefined (value: any) {
  return typeof value !== 'undefined'
}

export function isObject (value: any): boolean {
  return !!value && typeof value === 'object'
}

export function isPlainObject (value: any): boolean {
  return isObject(value) && !Array.isArray(value)
}

export function assign (target, source) {
  Object.keys(target).forEach(key => {
    const value = source[key]
    if (typeof value !== 'undefined') {
      target[key] = value
    }
  })
}

export function get (obj: any, path: string | string[]): any {
  const props: string[] = typeof path === 'string'
    ? path.split('.')
    : path
  const prop: string | undefined = props.shift()
  if (obj && prop) {
    obj = obj[prop]
    return props.length > 0
      ? get(obj, props)
      : obj
  }
}

export function resolve (done: Function | undefined, value?: any) {
  if (typeof done === 'function') {
    return done(value)
  }
  return Promise.resolve(value)
}
