# `jest-chrome-fake`


## Abstract

Jest Chrome Fake is a set of factories to provide **working implementations** of Chrome Web Extension APIs for use in Jest.

This enables you to test your extension code against stub data you provide, and see real results:

```js
import { mockTabs } from 'jest-chrome-fake'
import { queryTabs } from '@/services/tabs'

mockTabs([
  { id: 1, url: 'https://linkedin.com' },
  { id: 2, url: 'https://google.com' },
  { id: 3, url: 'https://msn.com' },
])

it('should search tabs', function() {
  queryTabs('goo', tabs => {
    expect(tabs[0].url).toBe('https://google.com')
  })
})
```

The library is built on top of [Jest Chrome](https://github.com/extend-chrome/jest-chrome) which provides base mocks for the entire Chrome API:

```js
it('should have called query', function() {
  expect(chrome.tabs.query).toHaveBeenCalled()
})
```

It is also compatible with Web Extension Polyfill library, meaning you can use Mozilla's promise-based `browser.*` namespace in your application code, and your tests will work without any additional setup; see [Setup](#setup) for more details.

Note that any implementations should attempt to:

- replicate the live extension environment as closely as possible
- provide logical or sensible defaults where only partial stub data is given
- manage data within their own namespace only

What this means in practice is that modifying a tab's URL will update the tab, but will not extend to updating any faked history items.

## Setup

Install via Yarn or NPM:

```sh
npm i jest-chrome jest-chrome-fake -D
```

Then, follow the setup instructions at [Jest Chrome](https://github.com/extend-chrome/jest-chrome).

## Usage

Generally, usage goes like this:

- import one or more mock functions
- mock the api using the correct helper
- run your tests
- reset implementation if required

See full examples in the [tests/](tests/) folder.

## Contributing

Right now, this library has only partial implementations that the author needed for one particular project.

However, the API has been scraped and prioritised:

- [High Priority](https://github.com/likelylogic/jest-chrome-fake/issues?q=is%3Aopen+is%3Aissue+milestone%3A%22High+Priority%22)
- [Low Priority](https://github.com/likelylogic/jest-chrome-fake/issues/1)

If you think you can help with further implementations:

- check the [issues/](issues/) to see what needs to be done
- review existing source code in [src/api/](src/api/)
- write your implementation
- add tests
- submit a PR

Thanks.
