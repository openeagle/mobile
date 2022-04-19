import { EaxiosError } from '@openeagle/eaxios'
import { Toast as VantToast, ToastOptions as VantToastOptions } from 'vant'
import { onUnmounted } from 'vue'

export interface ToastErrorOptions extends Omit<VantToastOptions, 'message'> {
  message: {
    [key: string]: string
  }
}

export type ToastParams = string | VantToastOptions | EaxiosError

const failure = {
  UNKNOWN: 'UNKNOWN',
  REQUEST_OFFLINE: 'REQUEST_OFFLINE',
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
  SERVER_ERROR: 'SERVER_ERROR',
  RESPONSE_INVALID: 'RESPONSE_INVALID',
  EMPTY: 'EMPTY',
}

const messages: {
  [key: string]: string
} = {
  [failure.UNKNOWN]: '请求失败了~',
  [failure.REQUEST_OFFLINE]: '网络异常~',
  [failure.REQUEST_TIMEOUT]: '网络有点慢~',
  [failure.SERVER_ERROR]: '服务器异常~',
  [failure.RESPONSE_INVALID]: '服务器出错了~',
  [failure.EMPTY]: '暂无数据~',
}

function useToast() {
  let loading = false
  const getVantToastOptions = (
    params: ToastParams,
    options?: ToastErrorOptions
  ): string | VantToastOptions => {
    if (params instanceof Error) {
      const error = params
      let message: string
      if (
        error.code !== undefined &&
        (messages[error.code] || options?.message?.[error.code])
      ) {
        message = options?.message[error.code] || messages[error.code]
      } else {
        message = error.message || messages[failure.UNKNOWN]
      }
      return {
        ...options,
        type: 'fail',
        message,
      }
    }
    return params
  }
  const toast = (params: ToastParams, options?: ToastErrorOptions) => {
    const vantToastOptions = getVantToastOptions(params, options)
    if (typeof vantToastOptions === 'string') {
      loading = false
    } else if (vantToastOptions.type === 'loading') {
      loading = true
    } else {
      loading = false
    }
    VantToast(vantToastOptions)
  }
  toast.loading = (params: ToastParams) => {
    loading = true
    const vantToastOptions = getVantToastOptions(params)
    const options: VantToastOptions = { forbidClick: true }
    if (typeof vantToastOptions === 'string') {
      options.message = vantToastOptions
    } else {
      Object.assign(options, vantToastOptions)
    }

    VantToast.loading(options)
  }
  toast.success = (params: ToastParams) => {
    loading = false
    VantToast.success(getVantToastOptions(params))
  }
  toast.fail = (params: ToastParams, options?: ToastErrorOptions) => {
    loading = false
    VantToast.fail(getVantToastOptions(params, options))
  }
  toast.clear = () => {
    loading = false
    VantToast.clear()
  }
  toast.failure = failure
  toast.messages = messages
  onUnmounted(() => {
    if (loading) {
      toast.clear()
    }
  })
  return toast
}

export default useToast
