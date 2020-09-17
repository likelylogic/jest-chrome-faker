import { chrome } from 'jest-chrome'
import { isPlainObject, resolve } from '@utils/helpers'
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
    get (key: string | string[] | Hash | null, callback?: Callback): Hash {
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
      return resolve(callback, value)
    },

    getBytesInUse (keys: string | string[], callback?: Callback) {
      const data = this.get(keys)
      const json = JSON.stringify(data)
      return resolve(callback, json.length)
    },

    set (items: Hash, callback?: Callback) {
      Object.assign(data, items)
      return resolve(callback)
    },

    remove (key: string | string[], callback ?: Callback) {
      Array.isArray(key)
        ? key.forEach(key => delete data[key])
        : delete data[key]
      return resolve(callback)
    },

    clear (callback ?: Callback) {
      data = {}
      return resolve(callback)
    },
  }

  // mock
  return mock(`storage.${type}`, mocked)
}
