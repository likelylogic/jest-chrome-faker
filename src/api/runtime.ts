import { chrome } from 'jest-chrome'
import { mock } from '../utils/chrome'

export function fakeRuntime () {
  const mocked: any = {}
  return mock('runtime', mocked)
}
