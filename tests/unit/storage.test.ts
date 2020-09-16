import { chrome } from 'jest-chrome'
import { fakeStorage } from '@/index'

describe('storage', function () {
  let reset: () => any
  const storage = chrome.storage.local
  const data = { foo: 1 }

  beforeAll(async function () {
    reset = fakeStorage('local', data)
  })

  it('should set data', function () {
    storage.set({ foo: 100 }, () => {
      expect(data.foo).toEqual(100)
    })
  })

  it('should get data', function () {
    storage.get('foo', (value) => {
      expect(value).toStrictEqual({ foo: 100 })
    })
    storage.get('bar', (value) => {
      expect(value).toStrictEqual({ bar: undefined })
    })
  })

  it('should log all calls', function () {
    expect(storage.set).toHaveBeenCalledTimes(1)
    expect(storage.get).toHaveBeenCalledTimes(2)
  })

  it('should reset', function () {
    reset()
    expect(storage.set).toHaveBeenCalledTimes(0)
    expect(storage.get).toHaveBeenCalledTimes(0)
  })
})
