import { chrome } from 'jest-chrome'
import { fakeTabs } from '@/index'
import { partial, linkedIn, google, msn } from '../helpers'

describe('tabs', function () {
  let reset: () => any
  const tabs = chrome.tabs
  const data = [
    linkedIn,
    google,
    msn,
  ]

  beforeAll(async function () {
    reset = fakeTabs(data)
  })

  it('should get one tab', function () {
    tabs.get(1, (tab) => {
      expect(tab).toEqual(partial(linkedIn))
    })
  })

  it('should query one tab', function () {
    const target = google
    tabs.query({ url: target.url }, (tabs) => {
      expect(tabs.length).toBe(1)
      expect(tabs).toEqual([partial(target)])
    })
  })

  it('should query all tabs', function () {
    tabs.query({}, (tabs) => {
      expect(tabs).toEqual(data.map(tab => partial(tab)))
    })
  })

  afterAll(function () {
    reset()
  })
})
