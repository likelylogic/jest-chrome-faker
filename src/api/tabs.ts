import { chrome } from 'jest-chrome'
import { getId, getTitle, mock } from '@utils/chrome'
import { assign, resolve } from '@utils/helpers'

// ---------------------------------------------------------------------------------------------------------------------
// classes
// ---------------------------------------------------------------------------------------------------------------------

import QueryInfo = chrome.tabs.QueryInfo

export class Tab implements chrome.tabs.Tab {
  id = 0
  windowId = 0
  active = false
  audible = false
  autoDiscardable = true
  discarded = false
  favIconUrl = ''
  height = 945
  highlighted = true
  incognito = false
  index = 0
  mutedInfo = { muted: false }
  pinned = false
  selected = true
  status = 'complete'
  title = ''
  url = ''
  width = 1920

  constructor (data: Hash) {
    assign(this, data)
    this.id = getId(data.id) as number
    this.title = data.title || getTitle(data.url)
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// factory
// ---------------------------------------------------------------------------------------------------------------------

export function fakeTabs (data: Partial<Tab>[] = []) {
  // database
  const db: Tab[] = data.map(data => new Tab(data))

  // mocked
  const mocked: any = {
    get (id: number, callback ?: Callback) {
      const tab: Tab | undefined = db.find(tab => tab.id === id)
      return resolve(callback, tab)
    },

    query (info: QueryInfo, callback ?: Callback) {
      // get keys
      const keys = Object.keys(info)

      // empty object, return all tabs
      if (keys.length === 0) {
        return resolve(callback, [...db])
      }

      // has query, filter tabs
      const tabs: Tab[] = db.filter((tab: Tab) => {
        return keys.every(key => {
          return tab[key as keyof Tab] === info[key as keyof QueryInfo]
        })
      })

      // resolve
      resolve(callback, tabs)
    },
  }

  return mock('tabs', mocked)
}
