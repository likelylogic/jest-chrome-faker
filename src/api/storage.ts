import { chrome } from 'jest-chrome'
import { isPlainObject } from '@utils/helpers'
import { resolve, mock } from '@utils/chrome'

type StorageAreaType = 'local' | 'managed' | 'sync'

export function fakeStorage(type: StorageAreaType = 'local', data: Hash = {}) {

  const mocked: any = {
    get(key: string | string[] | Hash | null, callback?: Callback): Hash {
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

    getBytesInUse(keys: string | string[], callback?: Callback) {
      const data = this.get(keys)
      const json = JSON.stringify(data)
      return resolve(callback, json.length)
    },

    set(items: Hash, callback?: Callback) {
      Object.assign(data, items)
      return resolve(callback)
    },

    remove(key: string | string[], callback ?: Callback) {
      Array.isArray(key)
        ? key.forEach(key => delete data[key])
        : delete data[key]
      return resolve(callback)
    },

    clear(callback ?: Callback) {
      data = {}
      return resolve(callback)
    },
  }

  // storage
  const storage: any = chrome.storage[type]

  // mock
  return mock(storage, mocked)
}
