import { chrome } from 'jest-chrome'
import { get } from '@likelylogic/collection-fns'
import { getId, getTitle, mock, mockEvent } from '@utils/chrome'
import { assign, resolve, clone } from '@utils/helpers'

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
  openerTabId?: number
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

  constructor (data: Partial<Tab>) {
    assign(this, data)
    this.id = getId(data.id) as number
    this.title = data.title || getTitle(data.url)
    this.favIconUrl = data.favIconUrl || getFavIconUrl(data.url!)
  }
}

type TabData = Partial<Tab>

// ---------------------------------------------------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------------------------------------------------

function makeDatabase (data: TabData[] = []) {
  return data.map(data => new Tab(data))
}

function getFavIconUrl(url: string) {
  const matches = url.match(/^(https?:\/\/(www\.)?[^\/]+)/)
  return matches
    ? matches[1] + '/favicon.ico'
    : ''
}

// ---------------------------------------------------------------------------------------------------------------------
// factory
// ---------------------------------------------------------------------------------------------------------------------

export function fakeTabs (data: TabData[] = []) {
  // database
  const db: Tab[] = makeDatabase(data)

  // changes
  const fire = mockEvent('tabs')

  // mocked
  const mocked: any = {
    get (tabId: number, done: Function) {
      const tab: Tab | undefined = get(db, tabId)
      resolve(done, tab)
    },

    query (info: QueryInfo, done: Function) {
      // get keys
      const keys = Object.keys(info)

      // empty object, return all tabs
      if (keys.length === 0) {
        resolve(done, [...db])
      }

      // has query, filter tabs
      else {
        const tabs: Tab[] = db.filter((tab: Tab) => {
          return keys.every(key => {
            return tab[key as keyof Tab] === info[key as keyof QueryInfo]
          })
        })
        resolve(done, tabs)
      }
    },

    update (tabId: number, info: chrome.tabs.UpdateProperties, done: Function) {
      // helpers
      function isValid (tab: Tab, info: chrome.tabs.UpdateProperties, prop: keyof chrome.tabs.UpdateProperties) {
        return info[prop] !== undefined && tab[prop] !== info[prop]
      }

      // variables
      const tab: Tab | undefined = get(db, tabId)
      const changes: chrome.tabs.TabChangeInfo = {}

      // take action
      if (tab) {
        // actions
        if (isValid(tab, info, 'pinned')) {
          changes.pinned = info.pinned
          tab.pinned = !!info.pinned
        }

        if (isValid(tab, info, 'autoDiscardable')) {
          tab.autoDiscardable = !!info.autoDiscardable
          changes.autoDiscardable = info.autoDiscardable
        }

        if (isValid(tab, info, 'openerTabId')) {
          // TODO need to check tab's window
          tab.openerTabId = info.openerTabId
        }

        if (isValid(tab, info, 'muted')) {
          const mutedInfo = {
            muted: !!info.muted,
            reason: 'user'
          }
          tab.mutedInfo = mutedInfo
          changes.mutedInfo = mutedInfo
        }

        if (info.url && tab.url !== info.url) {
          tab.url = info.url
          tab.title = getTitle(info.url)
          tab.favIconUrl = getFavIconUrl(info.url)
          tab.status = 'complete'
          changes.url = info.url
          changes.title = tab.title
          changes.favIconUrl = tab.favIconUrl
          changes.status = 'complete'
          // TODO update connected items like history (or should history listen to tabs?)
        }

        if (isValid(tab, info, 'active')) {
          tab.active = !!info.active
          fire('activated', {
            windowId: tab.windowId,
            tabId: tab.id,
          })
        }

        if (isValid(tab, info, 'highlighted')) {
          tab.highlighted = !!info.highlighted
          fire('highlighted', {
            windowId: tab.windowId,
            tabIds: [tab.id], // TODO should be all highlighted tabs in window
          })
        }

        // events
        if (Object.keys(changes)) {
          fire('updated', tabId, info, tab)
        }

        // resolve
        resolve(done, changes, tab)
      }
    },

    discard (tabId: number, done: Function) {
      const tab: Tab | undefined = get(db, tabId)
      if (tab) {
        const info: chrome.tabs.TabChangeInfo = { discarded: true }
        Object.assign(tab, info)
        fire('updated', tabId, info, tab)
      }
      resolve(done, tab)
    }
  }

  return mock('tabs', mocked)
}
