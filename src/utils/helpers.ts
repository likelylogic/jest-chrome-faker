export function isDefined (value: any) {
  return typeof value !== 'undefined'
}

export function isObject (value: any): boolean {
  return !!value && typeof value === 'object'
}

export function isPlainObject (value: any): boolean {
  return isObject(value) && !Array.isArray(value)
}

export function mock (real: Hash, mock: Hash) {
  // mock
  Object.keys(mock).forEach(key => {
    real[key].mockImplementation(mock[key])
  })

  // reset
  return function () {
    Object.keys(mock).forEach(key => {
      real[key].mockReset()
    })
  }
}
