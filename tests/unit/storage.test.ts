import { chrome } from 'jest-chrome'
import { fakeStorage } from '@/index'
import { inspect } from '../helpers'

let reset: () => any
const storage = chrome.storage.local
const data = { foo: 1 }

beforeAll(async function () {
  reset = fakeStorage(data)
})

describe('methods', function () {
  it('set', function () {
    storage.set({ foo: 100 }, () => {
      expect(storage.set).toHaveBeenCalled()
    })
  })

  it('get', function () {
    storage.get('foo', (value) => {
      expect(value).toStrictEqual({ foo: 100 })
    })
    storage.get('bar', (value) => {
      expect(value).toStrictEqual({ bar: undefined })
    })
  })

  it('remove', function () {
    storage.remove('bar', () => {
      storage.get('bar', (value) => {
        expect(value).toStrictEqual({ bar: undefined })
      })
    })
  })

  it('clear', function () {
    storage.clear(() => {
      storage.get({}, (value) => {
        expect(value).toStrictEqual({})
      })
    })
  })

  it('reset', function () {
    reset()
    expect(storage.set).toHaveBeenCalledTimes(0)
    expect(storage.get).toHaveBeenCalledTimes(0)
  })
})

describe('events', function () {

  let reset: () => any
  const storage = chrome.storage.local
  const data = { foo: 1 }
  let spy, onChanged

  beforeAll(async function () {
    fakeStorage(data)
    spy = jest.fn()
    onChanged = chrome.storage.onChanged
    onChanged.addListener(spy)
  })

  it('set', async function () {
    storage.set({ foo: 2, bar: 3 })
    expect(spy).toHaveBeenNthCalledWith(1, {
      foo: { oldValue: 1, newValue: 2 },
      bar: { newValue: 3 },
    }, 'local')
  })

  it('remove', async function () {
    storage.remove('foo')
    expect(spy).toHaveBeenNthCalledWith(2, {
      foo: { oldValue: 2 },
    }, 'local')
  })

  it('clear', async function () {
    storage.clear()
    expect(spy).toHaveBeenNthCalledWith(3, {
      bar: { oldValue: 3 },
    }, 'local')
  })

})
