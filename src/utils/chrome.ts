let _id = 0

export function getId(id?: number | string): number | string {
  return id || ++_id
}

export function getTime(seconds: number) {
  return seconds * 1000
}

export function getTitle(url = '') {
  const text = url
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .replace(/[?#].+$/, '')
  const matches = text
    .match(/\w+/g)
  return matches
    ? matches.map(word => word.replace(/\w/, c => c.toUpperCase())).join(' ')
    : text
}

export function resolve(callback: Callback | undefined, value?: any) {
  if (typeof callback === 'function') {
    return callback(value)
  }
  return Promise.resolve(value)
}

export function mock (real: Hash, mock: Hash) {
  // mock
  Object.keys(mock).forEach(key => {
    real[key].mockImplementation(mock[key])
  })

  // reset
  return function () {
    Object.keys(mock).forEach(key => {
      real[key].mockReset()
    })
  }
}
