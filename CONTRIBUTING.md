# Contributing

## Overview

Thanks for reading this document.

Either you want to contribute, or you want to know how it works.

## Repository

The repository is laid out as below:

```
+- src
|   +- api          <- implementations
|   +- classes      <- shared classes and factories
|   +- utils        <- useful utilities
+- tests
    +- unit         <- unit tests for each of the apis
    +- contract     <- contract tests for each of the apis
```

## Strategy

The Chrome API is large, so modelling everything explicitly would be a big – and possibly futile – job.

Rather, a "good enough" attempt can be made to fake what is useful: 

- **API** - only some of the API can be reasonably faked
- **Methods** - should update internal state and return accurate responses 
- **Events** - events are currently not handled, but the plan is to handle them 

Implementations of each API should:

- Implement the API, i.e. `api/tabs`
- Add relevant classes, i.e. `classes/Tab`
- Add tests, i.e. `tests/tabs` 

## Writing an implementation

The pattern for creating fakes is as follows: 

```js
mock<Thing>(<data>, <options>)
```

Because most APIs are stateful, implementations should:

- consume / transform the stub data
- build a database if needs be
- mock expected methods
- create and return the mocked object

History is an example of an API that requires both setup and classes:

```js
import { chrome } from 'jest-chrome'
import { isDefined } from '../utils/helpers'
import { getId, getTime, getTitle, mock, resolve } from '../utils/chrome'

// type aliases
import HistoryQuery = chrome.history.HistoryQuery
import HistoryItem = chrome.history.HistoryItem
import VisitItem = chrome.history.VisitItem

// helper types
type Visit = {
  ...
}

// helper functions
function makeVisit (data) {
  ...
}

function makeDatabase (data: Visit[] = []) {
  ...
}

// factory
export function fakeHistory (data: Visit[] = []) {
  // database
  const db = makeDatabase(data)

  // mock
  const mocked: any = {
    getVisits (details: { url: string }, callback ?: Callback) {
      const historyItem = db.historyItems.find(item => item.url === details.url)
      const items = historyItem
        ? db.visitItems.filter(visit => visit.id === historyItem.id)
        : []
      return resolve(callback, items)
    },
    ...
  }
  return mock('history', mocked)
}
```

Using helpers and factory functions makes it easy to separate responsibilities, test and maintain the code.

## Contributing

If you think you can help with further implementations:

- check the [issues](https://github.com/likelylogic/jest-chrome-faker/issues) to see what needs to be done
- review existing [source code](src) (including utilities)
- open a ticket, or comment on an existing ticket, and discuss
- if appropriate, write your implementation
- add [tests](tests) for each faked entity
- submit a PR

Thanks.
