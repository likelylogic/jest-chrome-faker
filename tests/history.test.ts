import { chrome } from 'jest-chrome'
import { fakeHistory } from '../src'

function partial (obj: Hash) {
  return expect.objectContaining(obj)
}

describe('history', function() {

  let reset: () => any
  const history = chrome.history
  const data = [
    { url: 'https://linkedin.com', title: 'Linked In' },
    { url: 'https://google.com', title: 'Google' },
    { url: 'https://msn.com', title: 'MSN' },
    { url: 'https://msn.com', title: 'MSN' },
    { url: 'https://msn.com', title: 'MSN' },
    { url: 'https://msn.com', title: 'MSN' },
  ]

  beforeAll(async function() {
    reset = fakeHistory(data)
  })

  it('should get all visits for a single URL', function() {
    history.getVisits({ url: data[2].url }, (visits) => {
      expect(visits.length).toEqual(4)
    })
  })

  it('should get search info for empty text', function() {
    history.search({ text: '' }, (items) => {
      expect(items).toEqual([
        partial({ url: data[0].url, visitCount: 1, lastVisitTime: 0 }),
        partial({ url: data[1].url, visitCount: 1, lastVisitTime: 1000 }),
        partial({ url: data[2].url, visitCount: 4, lastVisitTime: 5000 }),
      ])
    })
  })

  it('should get search info for text', function() {
    history.search({ text: 'n' }, (items) => {
      expect(items).toEqual([
        partial({ url: data[0].url, visitCount: 1, lastVisitTime: 0 }),
        partial({ url: data[2].url, visitCount: 4, lastVisitTime: 5000 }),
      ])
    })
  })

  it('should get search results after startTime', function() {
    history.search({ text: '', startTime: 4000 }, (items) => {
      expect(items.length).toEqual(1)
    })
  })

  it('should get search results before endTime', function() {
    history.search({ text: '', endTime: 4000 }, (items) => {
      expect(items.length).toEqual(2)
    })
  })

  afterAll(function() {
    reset()
  })

})
