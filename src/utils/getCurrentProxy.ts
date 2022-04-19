import type { ComponentPublicInstance } from 'vue'
import { getCurrentInstance } from 'vue'

/**
 * 获取 vue 组件示例，返回值等同于 option api 的 this
 *
 * @returns
 */
function getCurrentProxy(): ComponentPublicInstance {
  return getCurrentInstance()?.proxy as any
}

export default getCurrentProxy
