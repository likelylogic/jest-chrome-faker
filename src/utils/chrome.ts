let _id = 0

export function getId(id?: number | string) {
  return id || ++_id
}

export function resolve(callback: Callback | undefined, value?: any) {
  if (typeof callback === 'function') {
    return callback(value)
  }
  return Promise.resolve(value)
}
