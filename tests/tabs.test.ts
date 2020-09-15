import { chrome } from 'jest-chrome'
import { mockTabs } from '../src'

describe('tabs', function() {

  const tabs = chrome.tabs
  let restore: () => any
  const data = [
    { id: 1, url: 'http://linkedin.com', title: 'Linked In' },
    { id: 2, url: 'http://google.com', title: 'Google' },
    { id: 3, url: 'http://msn.com', title: 'MSN' },
  ]

  beforeAll(async function() {
    restore = mockTabs(data)
  })

  it('should get tabs', function() {
    tabs.get(1, (tab) => {
      expect(tab).toEqual(data[0])
    })
  })

  it('should query one tab', function() {
    const target = data[1]
    tabs.query({ url: target.url }, (tabs) => {
      expect(tabs.length).toBe(1)
      expect(tabs[0]).toStrictEqual(target)
    })
  })

  it('should query all tabs', function() {
    tabs.query({}, (tabs) => {
      expect(tabs).toStrictEqual(data)
    })
  })

  afterAll(function() {
    restore()
  })

})
