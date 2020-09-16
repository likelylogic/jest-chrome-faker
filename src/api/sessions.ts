import { chrome } from 'jest-chrome'
import { getTime, resolve, mock } from '../utils/chrome'

import Filter = chrome.sessions.Filter
import Session = chrome.sessions.Session

// allow users to pass in partial test data
type SessionStub = Partial<chrome.sessions.Session>

export function fakeSessions (data: SessionStub[] = []) {
  // database
  // TODO super-basic implementation!
  const db: Session[] = data.map((data, index) => {
    const session: Session = {
      ...data,
      lastModified: data.lastModified || getTime(index),
    }
    return session
  })

  // mock
  const mocked: any = {
    getRecentlyClosed (filter: Filter, callback ?: Callback) {
      const maxResults = filter.maxResults || chrome.sessions.MAX_SESSION_RESULTS
      const sessions: Session[] = db.slice(0, maxResults)
      return resolve(callback, sessions)
    },
  }

  return mock('sessions', mocked)
}
