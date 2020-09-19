import jsonSize from 'json-size'
import { isPlainObject, clone, resolve, isDefined } from '@utils/helpers'
import { mock, mockEvent } from '@utils/chrome'

// ---------------------------------------------------------------------------------------------------------------------
// classes
// ---------------------------------------------------------------------------------------------------------------------

type StorageAreaType = 'local' | 'managed' | 'sync'

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

function serialize (value) {
  return JSON.stringify(value)
}

function deserialize (value) {
  return typeof value !== 'undefined'
    ? JSON.parse(value)
    : undefined
}

/**
 * Creates a database that stores serialised key => values
 * @param data
 */
function makeDatabase (data) {
  return Object.keys(data).reduce((output, key) => {
    output[key] = serialize(data[key])
    return output
  }, {})
}

/**
 * Creates an object that can track and notify listeners of changes
 * @param type
 * @param newStore
 */
function makeChangeHandler (type: StorageAreaType, newStore: Hash) {
  let oldStore = []
  let handler = mockEvent('storage')

  /**
   * Call this before modifying state to store the previous state
   */
  function init () {
    oldStore = clone(newStore)
  }

  /**
   * Call this after modifying state build changes and notify listeners
   */
  const call = () => {
    const changes = Object.keys({ ...oldStore, ...newStore })
      .reduce((changes, key) => {
        const oldValue = deserialize(oldStore[key])
        const newValue = deserialize(newStore[key])
        if (oldValue !== newValue) {
          const change: any = {}
          if (isDefined(oldValue)) {
            change.oldValue = oldValue
          }
          if (isDefined(newValue)) {
            change.newValue = newValue
          }
          changes[key] = change
        }
        return changes
      }, {})
    return handler('onChanged', changes, type)
  }

  return { init, call }
}

// ---------------------------------------------------------------------------------------------------------------------
// factory
// ---------------------------------------------------------------------------------------------------------------------

export function fakeStorage (data: Hash = {}, type: StorageAreaType = 'local') {

  // database
  const db = makeDatabase(data)

  // events
  const changes = makeChangeHandler(type, db)

  // mock
  const mocked: any = {
    get (keys: string | string[] | Hash | null, done: Function) {
      let value

      // all keys
      if (keys === null) {
        return this.get(Object.keys(db))
      }

      // string
      if (typeof keys === 'string') {
        return this.get([keys])
      }

      // array
      if (Array.isArray(keys)) {
        keys = keys.reduce((output: Hash, key) => {
          output[key] = undefined
          return output
        }, {})
        return this.get(keys)
      }

      // object
      if (isPlainObject(keys)) {
        value = Object.keys(keys!).reduce((output: Hash, key) => {
          const value = deserialize(db[key])
          output[key] = typeof value !== 'undefined' ? value : keys![key]
          return output
        }, {})
      }

      // return
      return resolve(done, value)
    },

    set (items: Hash, done: Function) {
      changes.init()
      Object.keys(items).forEach(key => {
        db[key] = serialize(items[key])
      })
      changes.call()
      return resolve(done)
    },

    remove (keys: string | string[], done: Function) {
      changes.init()
      Array.isArray(keys)
        ? keys.forEach(key => delete db[key])
        : delete db[keys]
      changes.call()
      return resolve(done)
    },

    clear (done: Function) {
      changes.init()
      Object.keys(db).forEach(key => {
        delete db[key]
      })
      changes.call()
      return resolve(done)
    },

    getBytesInUse (keys: string | string[], done: Function) {
      const data = this.get(keys)
      return resolve(done, jsonSize(data))
    },
  }

  // mock
  return mock(`storage.${type}`, mocked)
}
