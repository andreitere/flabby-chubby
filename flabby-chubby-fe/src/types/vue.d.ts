import { Dayjs } from 'dayjs'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dayjs: typeof Dayjs
  }
}
