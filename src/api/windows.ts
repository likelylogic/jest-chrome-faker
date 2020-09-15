import { chrome } from 'jest-chrome'
import { resolve, mock, getId } from '../utils/chrome'

// allow users to pass in partial test data
type WindowStub = Partial<chrome.windows.Window>

// TODO write a proper factory for this
function makeWindow (data: WindowStub) {
  data.id = getId(data.id) as number
  data.tabs = data.tabs || []
}

export function fakeWindows(data: WindowStub[] = []) {

  // database
  data.forEach(makeWindow)

  // mocked
  const mocked: any = {
    get(id: number, callback ?: Callback) {
      const window: WindowStub | undefined = data.find(window => window.id === id)
      return resolve(callback, window)
    },
  }

  return mock(chrome.windows, mocked)
}
