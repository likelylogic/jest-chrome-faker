import { get } from './helpers'

let chrome

export function setChrome (value) {
  chrome = value
}

export function getChrome () {
  return chrome
}

let _id = 0

export function getId (id?: number | string): number | string {
  return id || ++_id
}

export function getTime (seconds: number) {
  return seconds * 1000
}

export function getTitle (url = '') {
  const text = url
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .replace(/[?#].+$/, '')
  const matches = text
    .match(/\w+/g)
  return matches
    ? matches.map(word => word.replace(/\w/, c => c.toUpperCase())).join(' ')
    : text
}

export function mock (api: string, mock: Hash) {
  // debug
  if (!chrome) {
    throw new Error('[Jest Chrome Faker] : Call setChrome() before using fake functions')
  }

  // grab api
  const real = get(chrome, api)
  if (!real) {
    throw new Error(`[Jest Chrome Faker] : Invalid Chrome API "${api}"`)
  }

  // mock
  Object.keys(mock).forEach(key => {
    const fn = real[key]
    if (fn && fn.mockImplementation) {
      fn.mockImplementation(mock[key])
    }
    else {
      real[key] = mock[key]
    }
  })

  // reset
  return function () {
    Object.keys(mock).forEach(key => {
      const fn = real[key]
      if (fn && fn.mockReset) {
        fn.mockReset()
      }
      else {
        delete real[key]
      }
    })
  }
}

export function mockEvent (api: string) {
  return function (event: string, ...args) {
    if (!event.startsWith('on')) {
      event = 'on' + event.replace(/\w/, c => c.toUpperCase())
    }
    const handler = chrome[api][event]
    if (handler && handler.callListeners) {
      return handler.callListeners(...args)
    }
    throw new Error(`[Jest Chrome Faker] Unknown event "${api}.${event}"`)
  }
}
