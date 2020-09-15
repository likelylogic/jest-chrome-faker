import { chrome } from 'jest-chrome'
import { mockStorage } from '../src'

describe('storage', function() {

  let storage: chrome.storage.StorageArea
  let restore: () => any
  const data = { foo: 1 }

  beforeAll(async function() {
    restore = mockStorage('local', data)
    storage = chrome.storage.local
  })

  it('should set data', function() {
    storage.set({ foo: 100 }, () => {
      expect(data.foo).toEqual(100)
    })
  })

  it('should get data', function() {
    storage.get('foo', (value) => {
      expect(value).toStrictEqual({ foo: 100 })
    })
    storage.get('bar', (value) => {
      expect(value).toStrictEqual({ bar: undefined })
    })
  })

  it('should log all calls', function() {
    expect(storage.set).toHaveBeenCalledTimes(1)
    expect(storage.get).toHaveBeenCalledTimes(2)
  })

  it('should reset', function() {
    restore()
    expect(storage.set).toHaveBeenCalledTimes(0)
    expect(storage.get).toHaveBeenCalledTimes(0)
  })

})
