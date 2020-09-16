import { chrome } from 'jest-chrome'
import { mock } from '../utils/chrome'

export function fakeOmnibox () {
  const mocked: any = {}
  return mock('omnibox', mocked)
}
