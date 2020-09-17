import { chrome } from 'jest-chrome'
import { getTime, mock } from '@utils/chrome'
import { assign } from '@utils/helpers'
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

type SessionData = Partial<Session>

// ---------------------------------------------------------------------------------------------------------------------
// factory
// ---------------------------------------------------------------------------------------------------------------------

export function fakeSessions (data: SessionData[] = []) {
  // database
  // TODO fix naive implementation!
  const db: Session[] = data.map((data, index) => {
    return new Session({
      ...data,
      lastModified: data.lastModified || getTime(index),
    })
  })

  // mock
  const mocked: any = {
    getRecentlyClosed (filter: Filter, done: Function) {
      const maxResults = filter.maxResults || chrome.sessions.MAX_SESSION_RESULTS
      const sessions: Session[] = db.slice(0, maxResults)
      done(sessions)
    },
  }

  return mock('sessions', mocked)
}
