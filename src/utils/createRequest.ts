import { Toast } from 'vant'
import eaxios, { EaxiosRequestConfig, EaxiosInstance } from '@openeagle/eaxios'
// import { EVENT_LOGOUT } from '../constants'

export interface ResponseCodeConfig {
  ignore?: string[] // 忽略
  confirm?: string[] // 确认
  logout?: string[] // 登录失效
  success?: string // 请求成功
}

export interface RequestErrorMessages {
  UNKNOWN: string
  REQUEST_OFFLINE: string
  REQUEST_TIMEOUT: string
  SERVER_ERROR: string
  RESPONSE_INVALID: string
  REQUEST_ABORTED: string
  [key: string]: string
}

export const defaultResponseCodeConfig = {
  logout: [],
  success: '10000',
}

export const defaultRequestErrorMessages: RequestErrorMessages = {
  UNKNOWN: '未知错误',
  REQUEST_OFFLINE: '网络异常，请求失败了',
  REQUEST_TIMEOUT: '网络有点慢，请求超时了',
  SERVER_ERROR: '系统故障，请稍后再试',
  RESPONSE_INVALID: '系统出错，请求失败了',
  REQUEST_ABORTED: '请求已取消~',
}

/**
 *
 * @param options 默认请求配置
 * @param options.responseCode 响应码配置
 * @param options.errorMessages 错误消息配置，可以设置特定 code 为 false 或空字符标示不提示，如果要禁用所有情况，可以设置 showError
 * @param options.showError 是否显示错误信息，默认不显示
 * @returns 返回的 request 可以额外传递配置参数 errorMessages 和 showError，作用同上
 */
const createRequest = (
  options: EaxiosRequestConfig & {
    responseCode?: ResponseCodeConfig
    errorMessages?: RequestErrorMessages
    showError?: boolean
  }
): EaxiosInstance => {
  const {
    responseCode = defaultResponseCodeConfig,
    errorMessages = defaultRequestErrorMessages,
    showError = false,
    ...requestConfig
  } = options || {}
  const request = eaxios.create({
    timeout: 30000,
    transformResponse: [
      function (data, response) {
        if (data && typeof data === 'object') {
          const code = String(data.returncode || data.code)
          if (
            code ===
            (responseCode?.success || defaultResponseCodeConfig.success)
          ) {
            return data.body
          } else {
            throw eaxios.createError(data.message, code, response)
          }
        } else {
          throw eaxios.createError(
            data,
            response?.config?.responseError?.SERVER_ERROR || 'SERVER_ERROR',
            response
          )
        }
      },
    ],
    ...requestConfig,
  })

  request.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      if (error && error.code !== undefined && error.code !== null) {
        if ((responseCode?.logout || []).indexOf(error.code) >= 0) {
          // window.dispatchEvent(new Event(EVENT_LOGOUT))
        }
        if ((error.config?.showError ?? showError) === true) {
          const message =
            error.config?.errorMessages?.[error.code] ||
            errorMessages[error.code]
          if (message !== false && message !== '') {
            Toast.fail(message || error.message || '未知错误')
          }
        }
      }
      throw error
    }
  )
  return request
}

export default createRequest
