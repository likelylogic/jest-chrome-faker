import { getId, mock } from '@utils/chrome'
import { assign } from '@utils/helpers'
import windowStateEnum = chrome.windows.windowStateEnum
import windowTypeEnum = chrome.windows.windowTypeEnum

// ---------------------------------------------------------------------------------------------------------------------
// classes
// ---------------------------------------------------------------------------------------------------------------------

export class Window implements chrome.windows.Window {
  id = 0
  alwaysOnTop = false
  incognito = false
  focused = false
  state = 'normal' as windowStateEnum
  type = 'normal' as windowTypeEnum
  left = 0
  top = 0
  width = 1920
  height = 1024

  constructor (data: Hash) {
    assign(this, data)
    this.id = getId(data.id) as number
  }
}

type WindowData = Partial<Window>

// ---------------------------------------------------------------------------------------------------------------------
// factory
// ---------------------------------------------------------------------------------------------------------------------

export function fakeWindows (data: WindowData[] = []) {
  // database
  const db = data.map(data => new Window(data))

  // mocked
  const mocked: any = {
    get (id: number, info: chrome.windows.UpdateInfo, done: Function) {
      const window: Window | undefined = db.find(window => window.id === id)
      done(window)
    },

    getAll (info: chrome.windows.UpdateInfo, done: Function) {
      done([...db])
    }
  }

  return mock('windows', mocked)
}
