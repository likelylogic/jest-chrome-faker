import { chrome } from 'jest-chrome'
import { fakeHistory } from '@/index'
import { partial, linkedIn, google, msn } from '../helpers'

describe('history', function () {
  let reset: () => any
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
    reset = fakeHistory(data)
  })

  it('should get all visits for a single URL', function () {
    history.getVisits({ url: msn.url }, (visits) => {
      expect(visits.length).toEqual(4)
    })
  })

  it('should get search info for empty text', function () {
    history.search({ text: '' }, (items) => {
      expect(items).toEqual([
        partial({ url: linkedIn.url, visitCount: 1, lastVisitTime: 0 }),
        partial({ url: google.url, visitCount: 1, lastVisitTime: 1000 }),
        partial({ url: msn.url, visitCount: 4, lastVisitTime: 5000 }),
      ])
    })
  })

  it('should get search info for text', function () {
    history.search({ text: 'n' }, (items) => {
      expect(items).toEqual([
        partial({ url: linkedIn.url, visitCount: 1, lastVisitTime: 0 }),
        partial({ url: msn.url, visitCount: 4, lastVisitTime: 5000 }),
      ])
    })
  })

  it('should get search results after startTime', function () {
    history.search({ text: '', startTime: 4000 }, (items) => {
      expect(items.length).toEqual(1)
    })
  })

  it('should get search results before endTime', function () {
    history.search({ text: '', endTime: 4000 }, (items) => {
      expect(items.length).toEqual(2)
    })
  })

  afterAll(function () {
    reset()
  })
})
