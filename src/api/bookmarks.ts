import { chrome } from 'jest-chrome'
import { mock } from '../utils/chrome'

export function fakeBookmarks () {
  const mocked: any = {}
  return mock('bookmarks', mocked)
}
