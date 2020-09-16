import { chrome } from 'jest-chrome'
import { getId, getTitle, resolve, mock } from '../utils/chrome'

import QueryInfo = chrome.tabs.QueryInfo

// allow users to pass in partial test data
type TabStub = Partial<chrome.tabs.Tab>

function makeTab (data: TabStub) {
  data.id = getId(data.id) as number
  data.title = data.title || getTitle(data.url)
}

export function fakeTabs (data: TabStub[] = []) {
  // database
  data.forEach(makeTab)

  // mocked
  const mocked: any = {
    get (id: number, callback ?: Callback) {
      const tab: TabStub | undefined = data.find(tab => tab.id === id)
      return resolve(callback, tab)
    },

    query (info: QueryInfo, callback ?: Callback) {
      // get keys
      const keys = Object.keys(info)

      // empty object, return all tabs
      if (keys.length === 0) {
        return resolve(callback, [...data])
      }

      // has query, filter tabs
      const tabs: TabStub[] = data.filter((tab: TabStub) => {
        return keys.every(key => {
          return tab[key as keyof TabStub] === info[key as keyof QueryInfo]
        })
      })

      // resolve
      resolve(callback, tabs)
    },
  }

  return mock('tabs', mocked)
}
