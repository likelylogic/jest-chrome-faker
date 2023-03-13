import { chrome } from 'jest-chrome'
import { fakeTabs } from '@/index'
import { partial, linkedIn, google, msn } from '../helpers'
// import { Tabs } from 'jest-chrome/types/jest-chrome'

const tabs = chrome.tabs
const data = [
  linkedIn,
  google,
  msn,
]

describe('get', function () {
  beforeAll(async function () {
    fakeTabs(data)
  })

  it('should get one tab', function () {
    tabs.get(1, (tab) => {
      expect(tab).toEqual(partial(linkedIn))
    })
  })
})

describe('query', function () {
  beforeAll(async function () {
    fakeTabs(data)
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
})

describe('update', function () {
  let onUpdated,
    onHighlighted,
    onActivated

  beforeAll(async function () {
    fakeTabs(data)
    onUpdated = jest.fn()
    chrome.tabs.onUpdated.addListener(onUpdated)
    onHighlighted = jest.fn()
    chrome.tabs.onHighlighted.addListener(onHighlighted)
    onActivated = jest.fn()
    chrome.tabs.onActivated.addListener(onActivated)
  })

  it('pinned', async function () {
    const info = { pinned: true }
    tabs.update(1, info, (tab: chrome.tabs.Tab | undefined) => {
      expect(tab!.pinned).toBe(info.pinned)
      expect(onUpdated).toHaveBeenLastCalledWith(1, info, partial(info))
    })
  })

  it('autoDiscardable', async function () {
    const info = { autoDiscardable: true }
    tabs.update(1, info, (tab: chrome.tabs.Tab | undefined) => {
      expect(tab!.autoDiscardable).toBe(info.autoDiscardable)
      expect(onUpdated).toHaveBeenLastCalledWith(1, info, partial(info))
    })
  })

  it('openerTabId', async function () {
    const info = { openerTabId: 10 }
    tabs.update(1, info, (tab: chrome.tabs.Tab | undefined) => {
      expect(tab!.openerTabId).toBe(info.openerTabId)
      expect(onUpdated).toHaveBeenLastCalledWith(1, info, partial(info))
    })
  })

  it('muted', async function () {
    const info = { muted: true }
    tabs.update(1, info, (tab: chrome.tabs.Tab | undefined) => {
      expect(tab!.mutedInfo).toEqual(partial(info))
    })
  })

  it('url', async function () {
    const info = { url: google.url }
    tabs.update(1, info, (tab: chrome.tabs.Tab | undefined) => {
      expect(tab!.url).toEqual(info.url)
      expect(tab!.title).toEqual('Google Com')
      expect(onUpdated).toHaveBeenLastCalledWith(1, info, partial(info))
    })
  })

  it('active', async function () {
    const info = { active: true }
    tabs.update(1, info, (tab: chrome.tabs.Tab | undefined) => {
      expect(tab!.active).toBe(true)
      // expect(onActivated).toHaveBeenLastCalledWith(1, 0)
    })
  })

  it('highlighted', async function () {
    const info = { highlighted: true }
    tabs.update(1, info, (tab: chrome.tabs.Tab | undefined) => {
      expect(tab!.highlighted).toBe(true)
      expect(onHighlighted).toHaveBeenLastCalledWith(1, info, [1])
    })
  })
})
