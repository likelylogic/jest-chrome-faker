# Jest Chrome Faker


## Abstract

Jest Chrome Faker provides **working implementations** of parts of the [Chrome Web Extensions APIs](https://developer.chrome.com/extensions/devguide) for use in [Jest](https://jestjs.io/docs/en/getting-started) tests: 

```js
import { fakeTabs } from 'jest-chrome-faker'
import { someTabFunction } from '@/services/tabs'

beforeAll (() => {
  fakeTabs([
    { url: 'https://linkedin.com' },
    { url: 'https://google.com' },
    ...
  ])
})

it('should search tabs', () => {
  someTabFunction('goo', tabs => {
    expect(tabs[0].url).toBe('https://google.com')
  })
})
```

Whilst there are [limitations](#limitations) to this approach, it does allow you to test parts of your extension code against fake data, which otherwise would not be possible.

## Setup

Install the library and its peers via Yarn or NPM:

```sh
npm i jest jest-chrome jest-chrome-faker -D
```

Then, follow the setup instructions at [Jest Chrome](https://github.com/extend-chrome/jest-chrome).

## Usage

### Preamble

Jest Chrome Faker is designed to be used solely within your Jest test files.

The library is built on top of [Jest Chrome](https://github.com/extend-chrome/jest-chrome) which provides base mocks for the entire Chrome API:

```js
it('should have called query', function() {
  expect(chrome.tabs.query).toHaveBeenCalled()
})
```

It is also compatible with [Web Extension Polyfill](https://github.com/mozilla/webextension-polyfill) library, meaning you can use Mozilla's promise-based `browser.*` namespace in your application code, and your tests will work without any additional setup.

### Testing

Generally, usage goes like this:

- import one or more `fake*` functions
- fake one or more APIs using dummy data you provide
- write and run your tests

Below is an example setup for the Tabs API:

```js
import { chrome } from 'jest-chrome'
import { fakeTabs } from 'jest-chrome-faker'

describe('tabs', function() {

  let reset: () => any
  const tabs = chrome.tabs
  const data = [
    { id: 1, url: 'http://linkedin.com', title: 'Linked In' },
    { id: 2, url: 'http://google.com', title: 'Google' },
    { id: 3, url: 'http://msn.com', title: 'MSN' },
  ]

  beforeAll(async function() {
    reset = fakeTabs(data)
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
      expect(tabs).toStrictEqual([target])
    })
  })

  it('should query all tabs', function() {
    tabs.query({}, (tabs) => {
      expect(tabs).toStrictEqual(data)
    })
  })

  afterAll(function() {
    reset()
  })

})
```

See the [tests](tests/) folder for full examples for all available APIs.

## Project information

### Implementations

The library's implementations are meant to provide a usable base with which to test basic functionality.

Right now, the project's aims are to concentrate on **methods and data**, rather than events.

The current implementations aim to:

- replicate the methods and data functionality of the live extension environment
- generate missing data or provide sensible defaults when supplying stub data
- manage data within their own namespace only

### Limitations

What this means in practice is that modifying a tab's URL will update the tab, but will not:

- update related items, such as history
- fire any events that your code can listen and respond to

At some point, events will be investigated, hopefully with the result that they will complete the circle.

### Roadmap

At this moment, Jest Chrome faker has partial implementations of Storage, Tabs and History:

- [likelylogic/jest-chrome-faker/tree/master/src/api](src/api)

The rest of the APIs have been prioritised as follows:

- [High Priority](https://github.com/likelylogic/jest-chrome-fake/issues?q=is%3Aopen+is%3Aissue+milestone%3A%22High+Priority%22)
- [Low Priority](https://github.com/likelylogic/jest-chrome-fake/issues/1)

The plan is to work on completing the high priority items first, then reviewing which of the low priority items would be worth adding. As there are various non-testable APIs (for example, Tab Capture) it is likely that only a portion of the API will be fully faked.

## Contributing

If you think you can help with further implementations:

- check the [issues](https://github.com/likelylogic/jest-chrome-faker/issues) to see what needs to be done
- review existing [source code](src) (including utilities)
- open a ticket, or comment on an existing ticket, and discuss
- if appropriate, write your implementation
- add [tests](tests) for each faked entity
- submit a PR

Thanks.

