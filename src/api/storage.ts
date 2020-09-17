import { isPlainObject } from '@utils/helpers'
import { mock } from '@utils/chrome'

// ---------------------------------------------------------------------------------------------------------------------
// classes
// ---------------------------------------------------------------------------------------------------------------------

type StorageAreaType = 'local' | 'managed' | 'sync'

// ---------------------------------------------------------------------------------------------------------------------
// factory
// ---------------------------------------------------------------------------------------------------------------------

export function fakeStorage (data: Hash = {}, type: StorageAreaType = 'local') {
  const mocked: any = {
    get (key: string | string[] | Hash | null, callback: Function) {
      let value

      // all keys
      if (key === null) {
        value = data
      }

      // string
      else if (typeof key === 'string') {
        value = { [key]: data[key] }
      }

      // array
      else if (Array.isArray(key)) {
        key = key.reduce((output: Hash, key) => {
          output[key] = undefined
          return output
        }, {})
        return this.get(key)
      }

      // object
      else if (isPlainObject(key)) {
        value = Object.keys(key!).reduce((output: Hash, key) => {
          output[key] = undefined
          return output
        }, {})
      }

      // return
      callback(value)
    },

    getBytesInUse (keys: string | string[], callback: Function) {
      const data = this.get(keys)
      const json = JSON.stringify(data)
      callback(json.length)
    },

    set (items: Hash, callback: Function) {
      Object.assign(data, items)
      callback()
    },

    remove (key: string | string[], callback: Function) {
      Array.isArray(key)
        ? key.forEach(key => delete data[key])
        : delete data[key]
      callback()
    },

    clear (callback: Function) {
      data = {}
      callback()
    },
  }

  // mock
  return mock(`storage.${type}`, mocked)
}
