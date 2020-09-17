export const linkedIn = { url: 'http://linkedin.com', title: 'Linked In' }
export const google = { url: 'http://google.com', title: 'Google' }
export const msn = { url: 'http://msn.com', title: 'MSN' }

export const partial = expect.objectContaining
export function inspect (value) {
  const inspect = require('util').inspect
  console.log(inspect(value))
}
