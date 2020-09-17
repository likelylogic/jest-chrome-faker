# Contributing

## Overview

Thanks for reading this document.

Either you want to contribute, or you want to know how Jest Chrome Faker works.

## Repository

The repository is laid out as below:

```
+- src
|   +- api          <- implementations (factories and classes)
|   +- utils        <- useful utilities
+- tests
    +- unit         <- unit tests for each of the apis
    +- contract     <- contract tests for each of the apis
```

## Strategy

The Chrome API is large, so modelling *everything* explicitly would be a **big** (and probably futile) job.

Rather, a "good enough" attempt can be made to fake what is useful: 

- **API** - only some of the API can be reasonably faked
- **Methods** - should update internal state and return accurate responses 
- **Events** - events are currently not handled, but the plan is to handle them

See the [Roadmap](README.md#roadmap) section in the main readme for more information.

## Writing an implementation

### Overview

The primary interface to mock each API is a factory function of the format: 

```js
mock<API>(<data>, <options>)
```

It will set up the mock implementation and your extension code will be ready to test.

Implementations of each API should:

- Faithfully model methods, to provide parity with input and output
- Model internal data, so calls from start to finish will be accurate
- Add relevant model classes, so logic can be shared between APIs
- Add unit tests, so imlementations can be tested against various scenarios

Note that may not be not necessary to mock or model *everything*, but **no mock** is better than a **bad mock**.

### Code example

History is an example of an API that requires both setup and classes:

```js
import { chrome } from 'jest-chrome'
import { assign } from '../utils/helpers'
import { getId, getTime, getTitle, mock } from '../utils/chrome'

// classes
class HistoryItem implements chrome.history.HistoryItem {
  ...
}

// helpers
function makeDatabase (data: VisitData[] = []) {
  ...
}

// allows user to pass in only partial data
type VisitData = Partial<HistoryItem & VisitItem>

// factory
export function fakeHistory (data: VisitData[] = [], options?: any) {
  // database
  const db = makeDatabase(data)

  // mock
  const mocked: any = {
    getVisits (details: { url: string }, done: Function) {
      const historyItem = db.historyItems.find(item => item.url === details.url)
      const items = historyItem
        ? db.visitItems.filter(visit => visit.id === historyItem.id)
        : []
      done(items)
    },
    ...
  }
  return mock('history', mocked)
}
```

Note:

- The user should be able to supply:

  - only partial `data`
  - any additional `options` the factory needs

- The factory should:

  - provide an internal database under `db` to store and track data
  - transform supplied stub data into formal class instances
  - make any decisions to appropriately handle user input

  Factory methods should:

  - mock APIs appropriately and faithfully
  - set and get data to / from the database as required
  - return values using the `done()` callback

- Fake classes should

  - implement the appropriate Chrome interface
  - declare logical default values
  - assign user-supplied values on top
  - assign Chrome-specific values using utility functions such as `getId()`, `getTime()`, etc

## Contributing

If you think you can help with further implementations:

- check the [issues](https://github.com/likelylogic/jest-chrome-faker/issues) to see what needs to be done
- review existing [source code](src) (including utilities)
- open a ticket, or comment on an existing ticket, and discuss
- if appropriate, write your implementation
- add [tests](tests/unit) for each faked API
- submit a PR

Thanks.
