import { chrome } from 'jest-chrome'
import { isDefined } from '@utils/helpers'
import { getId, resolve, mock } from '@utils/chrome'

import HistoryQuery = chrome.history.HistoryQuery
import HistoryItem = chrome.history.HistoryItem
import VisitItem = chrome.history.VisitItem

type Visit = {
  /// Optional. The URL navigated to by a user
  url: string
  /// The unique identifier for the item
  id?: string
  /// Optional. The title of the page when it was last loaded
  title?: string
  /// Optional. When this visit occurred, represented in milliseconds since the epoch
  visitTime?: number
  /// The unique identifier for this visit
  visitId?: string
  /// The visit ID of the referrer
  referringVisitId?: string
  /// The transition type for this visit from its referrer
  transition?: string
}

function getTime(index: number) {
  return index * 1000
}

function getTitle(url: string) {
  const text = url.replace(/^(https?:\/\/)?(www\.)?/, '')
  const matches = text.match(/\w+/g)
  return matches ? matches.join(' ') : text
}

// factory
export function mockHistory(data: Visit[] = []) {

  // items and visits
  const historyItems: HistoryItem[] = []
  const visitItems: VisitItem[] = []

  // generate data
  data.forEach((visit: Visit, index) => {
    // variables
    const url = visit.url

    // history item
    let historyItem = historyItems.find(item => item.url === url)
    if (!historyItem) {
      historyItem = {
        id: String(getId()),
        url: visit.url,
        title: visit.title || getTitle(visit.url),
        lastVisitTime: 0,
        typedCount: 0,
        visitCount: 0,
      }
      historyItems.push(historyItem)
    }

    // visit item
    const visitItem: VisitItem = {
      id: historyItem.id,
      visitId: String(getId(visit.id)),
      referringVisitId: '0',
      visitTime: getTime(index),
      transition: 'link',
    }
    visitItems.push(visitItem)

    // update history item
    historyItem.lastVisitTime = visitItem.visitTime
    historyItem.visitCount!++
  })

  // mock
  const mocked: any = {
    getVisits(details: { url: string }, callback ?: Callback) {
      const historyItem = historyItems.find(item => item.url === details.url)
      const items = historyItem
        ? visitItems.filter(visit => visit.id === historyItem.id)
        : []
      return resolve(callback, items)
    },

    search(info: HistoryQuery, callback ?: Callback) {
      // items
      let items: HistoryItem[] = historyItems

      // free-text query
      if (isDefined(info.text)) {
        const text = info.text.toLowerCase()
        items = items.filter(item => {
          const url = (item.url || '').toLowerCase()
          const title = (item.title || '').toLowerCase()
          return url.includes(text) || title.includes(text)
        })
      }

      // visited before this date
      if (isDefined(info.endTime)) {
        items = items.filter(item => item.lastVisitTime! < info.endTime!)
      }

      // visited after this date
      if (isDefined(info.startTime)) {
        items = items.filter(item => item.lastVisitTime! > info.startTime!)
      }

      // maximum number of results
      items = items.slice(0, Math.max(info.maxResults || 0, 100))

      // resolve
      resolve(callback, items)
    },
  }

  return mock(chrome.history, mocked)
}
