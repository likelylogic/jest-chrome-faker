import { chrome } from 'jest-chrome'
import { getTime, mock } from '@utils/chrome'
import { assign, resolve } from '@utils/helpers'
import { Tab } from '@api/tabs'
import { Window } from '@api/windows'

// ---------------------------------------------------------------------------------------------------------------------
// classes
// ---------------------------------------------------------------------------------------------------------------------

import Filter = chrome.sessions.Filter

class Session implements chrome.sessions.Session {
  lastModified = 0
  tab?: Tab
  window?: Window

  constructor (data: Partial<Session> = {}) {
    assign(this, data)
  }
}

type SessionStub = Partial<Session>

// ---------------------------------------------------------------------------------------------------------------------
// factory
// ---------------------------------------------------------------------------------------------------------------------

export function fakeSessions (data: SessionStub[] = []) {
  // database
  // TODO super-basic implementation!
  const db: Session[] = data.map((data, index) => {
    return new Session({
      ...data,
      lastModified: data.lastModified || getTime(index),
    })
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
