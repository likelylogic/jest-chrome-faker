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
    get (key: string | string[] | Hash | null, done: Function) {
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
      done(value)
    },

    getBytesInUse (keys: string | string[], done: Function) {
      const data = this.get(keys)
      const json = JSON.stringify(data)
      done(json.length)
    },

    set (items: Hash, done: Function) {
      Object.assign(data, items)
      done()
    },

    remove (key: string | string[], done: Function) {
      Array.isArray(key)
        ? key.forEach(key => delete data[key])
        : delete data[key]
      done()
    },

    clear (done: Function) {
      data = {}
      done()
    },
  }

  // mock
  return mock(`storage.${type}`, mocked)
}
