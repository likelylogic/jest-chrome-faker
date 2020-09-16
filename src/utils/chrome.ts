import { get } from './helpers'

let chrome

export function setChrome (value) {
  chrome = value
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

export function resolve (callback: Callback | undefined, value?: any) {
  if (typeof callback === 'function') {
    return callback(value)
  }
  return Promise.resolve(value)
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
