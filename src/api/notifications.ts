import { chrome } from 'jest-chrome'
import { mock } from '@utils/chrome'

export function fakeNotifications() {
  const mocked: any = {}
  return mock(chrome.notifications, mocked)
}
