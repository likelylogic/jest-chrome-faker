import { chrome } from 'jest-chrome'
import { resolve, mock } from '@utils/chrome'

import QueryInfo = chrome.tabs.QueryInfo

// allow users to pass in partial test data
type TabStub = Partial<chrome.tabs.Tab>

export function fakeTabs(data: TabStub[] = []) {

  const mocked: any = {
    get(id: number, callback ?: Callback) {
      const tab: TabStub | undefined = data.find(tab => tab.id === id)
      return resolve(callback, tab)
    },

    query(info: QueryInfo, callback ?: Callback) {
      // get keys
      const keys = Object.keys(info)

      // empty object, return all tabs
      if (keys.length === 0) {
        return resolve(callback, [...data])
      }

      // has query, filter tabs
      const tabs: TabStub[] = data.filter((tab: TabStub) => {
        return keys.every(key => {
          return tab[key as keyof TabStub] == info[key as keyof QueryInfo]
        })
      })

      // resolve
      resolve(callback, tabs)
    },
  }

  return mock(chrome.tabs, mocked)
}
