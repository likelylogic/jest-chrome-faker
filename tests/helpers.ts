export const linkedIn = { url: 'https://linkedin.com', title: 'Linked In' }
export const google = { url: 'https://google.com', title: 'Google' }
export const msn = { url: 'https://msn.com', title: 'MSN' }

export const partial = expect.objectContaining
export function inspect (value) {
  const inspect = require('util').inspect
  console.log(inspect(value, { depth: null }))
}
