import { chrome } from 'jest-chrome'
import { isDefined, assign, resolve } from '@utils/helpers'
import { getId, getTime, getTitle, mock} from '@utils/chrome'
import HistoryQuery = chrome.history.HistoryQuery

// ---------------------------------------------------------------------------------------------------------------------
// classes
// ---------------------------------------------------------------------------------------------------------------------

export class HistoryItem implements chrome.history.HistoryItem {
  id = '0'
  url = ''
  title = ''
  lastVisitTime = 0
  typedCount = 0
  visitCount = 0

  constructor (data: Partial<HistoryItem> = {}) {
    assign(this, data)
    this.id = String(getId())
    this.url = data.url || ''
    this.title = data.title || getTitle(data.url)
  }
}

export class VisitItem implements chrome.history.VisitItem {
  id = ''
  visitId = ''
  referringVisitId = '0'
  visitTime = 0
  transition = 'link'

  constructor (data: Partial<VisitItem> = {}) {
    assign(this, data)
    this.visitId = String(getId())
  }
}

type VisitStub = {
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

// ---------------------------------------------------------------------------------------------------------------------
// factory
// ---------------------------------------------------------------------------------------------------------------------

function makeDatabase (data: VisitStub[] = []) {
  // items and visits
  const historyItems: HistoryItem[] = []
  const visitItems: VisitItem[] = []

  // generate data
  data.forEach((visit, index) => {
    // variables
    const url = visit.url

    // history item
    let historyItem = historyItems.find(item => item.url === url)
    if (!historyItem) {
      historyItem = new HistoryItem(visit)
      historyItems.push(historyItem)
    }

    // visit item
    const visitItem: VisitItem = new VisitItem({
      id: historyItem.id,
      visitTime: getTime(index),
    })
    visitItems.push(visitItem)

    // update history item
    historyItem.lastVisitTime = visitItem.visitTime
    historyItem.visitCount!++
  })

  return {
    historyItems,
    visitItems,
  }
}

// factory
export function fakeHistory (data: VisitStub[] = []) {
  // database
  const db = makeDatabase(data)

  // mock
  const mocked: any = {
    db,

    getVisits (details: { url: string }, callback ?: Callback) {
      const historyItem = db.historyItems.find(item => item.url === details.url)
      const items = historyItem
        ? db.visitItems.filter(visit => visit.id === historyItem.id)
        : []
      return resolve(callback, items)
    },

    search (info: HistoryQuery, callback ?: Callback) {
      // items
      let items: HistoryItem[] = db.historyItems

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

  return mock('history', mocked)
}
