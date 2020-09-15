# `jest-chrome-fake`


## Abstract

Jest Chrome Fake is a set of factories to provide **working implementations** of Chrome Web Extension APIs for use in Jest.

This enables you to test your extension code against fake data, and see real results:

```js
import { mockTabs } from 'jest-chrome-fake'
import { getTab } from '@/services/tabs'

mockTabs([
  { id: 1, url: 'http://linkedin.com' },
  { id: 2, url: 'http://google.com' },
  { id: 3, url: 'http://msn.com' },
])

it('should get tabs', function() {
  getTab(2, tab => {
    expect(tab.url).toEqual('http://google.com')
  })
})
```

The library is built on [Jest Chrome](https://github.com/extend-chrome/jest-chrome) which provides a complete mock of the Chrome API.

It is also compatible with Web Extension Polyfill library, meaning that you can use `browser.foo()` and it will just work; see [Setup](#setup) for more details.

The implementations attempt to be as accurate as possible within their own namespace, short of updating history when tabs load, for example.

## Setup

Install via Yarn or NPM:

```sh
npm i jest-chrome jest-chrome-fake -D
```

Then, follow the setup instructions at [Jest Chrome](https://github.com/extend-chrome/jest-chrome).

## Usage

See the example of testing code at  [tests/](tests/).

