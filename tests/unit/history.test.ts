import { chrome } from 'jest-chrome'
import { fakeHistory } from '@/index'
import { partial, linkedIn, google, msn } from '../helpers'

describe('history', function () {
  const history = chrome.history
  const data = [
    linkedIn,
    google,
    msn,
    msn,
    msn,
    msn,
  ]

  beforeAll(async function () {
    fakeHistory(data)
  })

  it('getVisits', function () {
    history.getVisits({ url: msn.url }, (visits) => {
      expect(visits.length).toEqual(4)
    })
  })

  it('search: with empty text', function () {
    history.search({ text: '' }, (items) => {
      expect(items).toEqual([
        partial({ url: linkedIn.url, visitCount: 1, lastVisitTime: 0 }),
        partial({ url: google.url, visitCount: 1, lastVisitTime: 1000 }),
        partial({ url: msn.url, visitCount: 4, lastVisitTime: 5000 }),
      ])
    })
  })

  it('search: with text', function () {
    history.search({ text: 'n' }, (items) => {
      expect(items).toEqual([
        partial({ url: linkedIn.url, visitCount: 1, lastVisitTime: 0 }),
        partial({ url: msn.url, visitCount: 4, lastVisitTime: 5000 }),
      ])
    })
  })

  it('search: after startTime', function () {
    history.search({ text: '', startTime: 4000 }, (items) => {
      expect(items.length).toEqual(1)
    })
  })

  it('search: before endTime', function () {
    history.search({ text: '', endTime: 4000 }, (items) => {
      expect(items.length).toEqual(2)
    })
  })
})
