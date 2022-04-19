import eaxios from '@openeagle/eaxios'
import { defineComponent } from 'vue'
import { useToast } from '../../../src/index'
import classes from './index.module.less'

export default defineComponent({
  setup() {
    const toast = useToast()
    return () => {
      return (
        <ul class={classes.list}>
          <li
            class={classes.item}
            onClick={() => {
              toast('文字提示')
            }}
          >
            文字提示
          </li>
          <li
            class={classes.item}
            onClick={() => {
              toast.loading('加载中...')
              setTimeout(() => {
                toast.clear()
              }, 2000)
            }}
          >
            加载提示
          </li>
          <li
            class={classes.item}
            onClick={() => {
              toast.success('成功提示')
            }}
          >
            成功提示
          </li>
          <li
            class={classes.item}
            onClick={() => {
              toast.fail('失败提示')
            }}
          >
            失败提示
          </li>
          <li
            class={classes.item}
            onClick={() => {
              toast.fail(
                eaxios.createError(
                  '未知错误',
                  toast.failure.UNKNOWN,
                  undefined as any
                )
              )
            }}
          >
            未知错误
          </li>
          <li
            class={classes.item}
            onClick={() => {
              toast.fail(
                eaxios.createError(
                  '暂无数据',
                  toast.failure.EMPTY,
                  undefined as any
                )
              )
            }}
          >
            暂无数据
          </li>
          <li
            class={classes.item}
            onClick={() => {
              toast.fail(
                eaxios.createError(
                  '网络异常',
                  toast.failure.REQUEST_OFFLINE,
                  undefined as any
                )
              )
            }}
          >
            网络异常
          </li>
          <li
            class={classes.item}
            onClick={() => {
              toast.fail(
                eaxios.createError(
                  '请求超时',
                  toast.failure.REQUEST_TIMEOUT,
                  undefined as any
                )
              )
            }}
          >
            请求超时
          </li>
          <li
            class={classes.item}
            onClick={() => {
              toast.fail(
                eaxios.createError(
                  '服务异常',
                  toast.failure.SERVER_ERROR,
                  undefined as any
                )
              )
            }}
          >
            服务异常
          </li>
          <li
            class={classes.item}
            onClick={() => {
              toast.fail(
                eaxios.createError(
                  '响应异常',
                  toast.failure.RESPONSE_INVALID,
                  undefined as any
                )
              )
            }}
          >
            响应异常
          </li>
          <li
            class={classes.item}
            onClick={() => {
              toast.fail(
                eaxios.createError('业务异常', '10001', undefined as any)
              )
            }}
          >
            业务异常
          </li>
          <li
            class={classes.item}
            onClick={() => {
              toast.fail(
                eaxios.createError(
                  '自定义错误码提示信息',
                  '10001',
                  undefined as any
                ),
                {
                  message: {
                    10001: '10001 自定义错误码提示信息',
                  },
                }
              )
            }}
          >
            自定义错误码提示信息
          </li>
        </ul>
      )
    }
  },
})
