# Jest Chrome Faker


## Abstract

Jest Chrome Faker provides **working implementations** of parts of the [Chrome API](https://developer.chrome.com/extensions/devguide) (Web Extensions) for use in [Jest](https://jestjs.io/docs/en/getting-started): 

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

Using fakes (or "[test doubles](https://martinfowler.com/bliki/TestDouble.html)") makes it simple to programatically test parts of your extension code which rely heavily on the Chrome API, in a test environment, at speed, using stub data.

Known as Integration Tests, Martin Fowler [says](https://martinfowler.com/bliki/IntegrationTest.html#:~:text=it's%20likely%20to%20significantly%20improve%20your%20testing%20speed):

> [Integration Tests] are likely to significantly improve your testing speed, ease of use, and resiliency.
>
> Since they are limited in scope, they often run very fast, so can run in early stages of a deployment pipeline, providing faster feedback should they go red.

Whilst at this early stage of development there are some [limitations](#limitations), the implementations' [source code](src/api) is fully decoupled from the base mock setup, and is easy to review, test and commit updates to.

Check the [roadmap](#roadmap) for development plans.

## Setup

### Installation

Install the library and its peers via Yarn or NPM:

```sh
npm i -D jest-chrome-faker jest-chrome jest
```

### Setup

#### Jest

Configure Jest to call a setup file directly before each test: 

```js
// jest.config.js
module.exports = {
  ...
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup/jest-chrome.js' // choose a path that works for you
  ]
}
```

Create the setup file as per your configuration, and add the following code:

```js
// jest-chrome.js
Object.assign(global, require('jest-chrome'))

require('jest-chrome-faker').setChrome(global.chrome)
```

#### Using Web Extension Polyfill

If you are using [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) (or the TypeScript version of it) so you can use Mozilla's promise-based `browser.*` namespace in your application code, you will need to add the following lines:

```js
// fix to enable webextension-polyfill in test environment
chrome.runtime.id = 'test'

// inject webextension-polyfill's `browser` variable into the global namespace
Object.assign(global, require('webextension-polyfill-ts'))
```

*Note: the JS and TS versions differ in their named and default exports, so adjust accordingly.*

#### Further help

For further information, see the docs for the associated libraries:

- [Jest Chrome](https://github.com/extend-chrome/jest-chrome)
- [Web Extension Polyfill](https://github.com/mozilla/webextension-polyfill)
- [Web Extension Polyfill for TypeScript](https://github.com/Lusito/webextension-polyfill-ts/)

## Usage

Generally, usage goes like this:

- import one or more `fake*` functions
- fake one or more APIs using dummy data you provide
- write and run your tests

Below is a fairly contrived example to demonstrate querying the API and using the generated data:

```ts
import { chrome } from 'jest-chrome'
import { browser } from 'webextension-polyfill-ts'
import { fakeTabs, fakeHistory } from 'jest-chrome-faker'

// stub data
const linkedIn = { url: 'http://linkedin.com', title: 'Linked In' }
const google = { url: 'http://google.com', title: 'Google' }
const msn = { url: 'http://msn.com', title: 'MSN' }

// tests
describe('integration', function () {

  beforeAll(async function () {
    fakeTabs([linkedIn, google, msn])
    fakeHistory([linkedIn, google, msn, msn, msn])
  })

  it('should query visit times based on tab title', async function () {
    const title = 'MSN'
    const tabs = await browser.tabs.query({ title })
    const url = tabs[0].url!
    const visits = await browser.history.getVisits({ url })
    const visitTimes = visits.map(visit => visit.visitTime)
    expect(visitTimes).toEqual([2000, 3000, 4000])
  })

})
```

The library aims to logically "fill in" missing data where it can.

As an example, the data returned from `history.getVisits()` is:

```js
[
  {
    id: '6',
    visitId: '9',
    referringVisitId: '0',
    visitTime: 2000,
    transition: 'link'
  },
  {
    id: '6',
    visitId: '10',
    referringVisitId: '0',
    visitTime: 3000,
    transition: 'link'
  },
  {
    id: '6',
    visitId: '11',
    referringVisitId: '0',
    visitTime: 4000,
    transition: 'link'
  }
]
```

As you can see, `id`s are unique and visit times are generated at 1-second intervals from the epoch.

See the [tests](tests/unit) folder for full examples for all available APIs.

## Project information

### How it works

The library is built on top of [Jest Chrome](https://github.com/extend-chrome/jest-chrome) which provides base mocks for the entire Chrome API:

```js
it('should have called query', function() {
  expect(chrome.tabs.query).toHaveBeenCalled()
})
```

Chrome Jest Faker builds on top of this and uses Jest's [mockImplementation()](https://jestjs.io/docs/en/22.x/mock-function-api#mockfnmockimplementationfn) to provide the actual functionality.

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

At this moment, Jest Chrome faker has partial implementations of some core APIs:

- [likelylogic/jest-chrome-faker/tree/master/src/api](src/api)

The rest of the APIs have been prioritised as follows:

- [High Priority](https://github.com/likelylogic/jest-chrome-fake/issues?q=is%3Aopen+is%3Aissue+milestone%3A%22High+Priority%22)
- [Low Priority](https://github.com/likelylogic/jest-chrome-fake/issues/1)

Check individual [API issues](https://github.com/likelylogic/jest-chrome-faker/issues/8) to see notes, and what has been completed.

The plan is to work on completing the high priority items first, then reviewing which of the low priority items would be worth adding. As there are various non-testable APIs (for example, Tab Capture) it is likely that only a portion of the API will be fully faked.

### API parity

To ensure parity to the APIs it mocks, the plan it to set up some kind of [Contract Tests](https://martinfowler.com/bliki/ContractTest.html) to compare the output of the source code against the real Chrome API. 

## Contributing

Please see the [contributing](contributing.md) document.

