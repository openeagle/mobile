import {
  PropType,
  computed,
  defineComponent,
  onBeforeUnmount,
  ref,
  watch,
} from 'vue'
import { Button, Empty, Loading } from 'vant'
import { EaxiosError } from '@openeagle/eaxios'
import { LoaderConfig, LoaderErrorConfig, LoaderOption } from './type'

const error = {
  UNKNOWN: 'UNKNOWN',
  REQUEST_ABORTED: 'REQUEST_ABORTED',
  REQUEST_OFFLINE: 'REQUEST_OFFLINE',
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
  SERVER_ERROR: 'SERVER_ERROR',
  RESPONSE_INVALID: 'RESPONSE_INVALID',
}

const defaultConfig: LoaderConfig = {
  loading: {
    image: 'spinner',
    message: '努力加载中...',
  },
  empty: {
    image: 'default',
    message: '暂无数据',
  },
  error: {
    UNKNOWN: { image: 'error', message: '未知错误' },
    REQUEST_ABORTED: { image: 'error', message: '请求已取消' },
    REQUEST_OFFLINE: { image: 'network', message: '网络异常' },
    REQUEST_TIMEOUT: { image: 'network', message: '请求超时' },
    SERVER_ERROR: { image: 'error', message: '加载失败了' },
    RESPONSE_INVALID: { image: 'error', message: '加载失败了' },
  },
}

const generateConfig = (
  ...configs: (LoaderOption | undefined)[]
): LoaderConfig => {
  const config: LoaderConfig = {
    loading: Object.assign({}, defaultConfig.loading),
    empty: Object.assign({}, defaultConfig.empty),
    error: Object.assign({}, defaultConfig.error),
  }
  for (let index = 0; index < configs.length; index++) {
    const customConfig = configs[index]
    if (customConfig) {
      if (customConfig.loading) {
        config.loading = Object.assign(config.loading, customConfig.loading)
      }
      if (customConfig.empty) {
        config.empty = Object.assign(config.empty, customConfig.empty)
      }
      if (customConfig.error) {
        config.error = Object.assign(config.error, customConfig.error)
      }
    }
  }
  return config
}

const Loader = defineComponent({
  name: 'EagLoader',
  props: {
    delay: {
      type: Number,
      default: 300,
      required: false,
    },
    /**
     * 是否空数据
     */
    empty: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否加载失败
     *
     * - 如果为 true 显示默认的错误样式和文案
     * - 如果是错误对象，显示默认的错误样式和错误对象的信息
     * - 如果是 HTTP 错误对象，跟进错误码显示特定的错误样式和错误对象的信息
     */
    error: {
      type: [Boolean, Object] as PropType<boolean | null | Error | EaxiosError>,
      default: false,
    },
    /**
     * 是否加载中
     */
    loading: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否支持重新加载
     */
    reloadable: {
      type: Boolean,
      default: true,
      required: false,
    },
    /**
     * 配置信息
     */
    option: Object as PropType<LoaderOption>,
  },
  emits: ['reload'],
  setup(props, { emit, slots }) {
    const config = computed(() => generateConfig(props.option))

    // 是否显示加载信息
    const show = computed(() => {
      return props.empty || props.error || props.loading
    })

    // 是否显示正在加载中（做了延迟处理，避免出现加载动画一闪而过的现象）
    const shouldShowLoading = ref(false)
    let loadingTimer: any = 0
    watch(
      () => props.loading,
      () => {
        if (props.loading) {
          loadingTimer = setTimeout(() => {
            if (props.loading) {
              shouldShowLoading.value = true
            }
            loadingTimer = 0
          }, props.delay)
        } else {
          if (loadingTimer > 0) {
            clearTimeout(loadingTimer)
            loadingTimer = 0
          }
          shouldShowLoading.value = false
        }
      },
      {
        immediate: true,
      }
    )
    onBeforeUnmount(() => {
      if (loadingTimer > 0) {
        clearTimeout(loadingTimer)
        loadingTimer = 0
      }
    })

    // 错误信息
    const errorConfig = computed<LoaderErrorConfig>(() => {
      if (props.error && (props.error as any).code) {
        return (
          config.value.error[(props.error as any).code] ||
          config.value.error.UNKNOWN
        )
      }
      return config.value.error.UNKNOWN
    })

    const handleReload = () => {
      emit('reload')
    }
    const renderLoading = () => {
      return slots.loading ? (
        slots.loading()
      ) : (
        <view class="zt-loader__content">
          <Loading
            class="zt-loader__loading"
            size="36"
            type={config.value.loading.image}
            vertical
          >
            {config.value.loading.message}
          </Loading>
        </view>
      )
    }
    const renderError = () => {
      return slots.error ? (
        slots.error()
      ) : (
        <Empty
          class="zt-loader__content"
          image={errorConfig.value.image}
          description={errorConfig.value.message}
        >
          {props.reloadable ? (
            <Button
              block
              hairline
              plain
              round
              size="small"
              type="primary"
              class="bottom-button"
              onClick={handleReload}
            >
              重新加载
            </Button>
          ) : null}
        </Empty>
      )
    }
    const renderEmpty = () => {
      return slots.error ? (
        slots.error()
      ) : (
        <Empty
          class="zt-loader__content"
          image={config.value.empty.image}
          description={config.value.empty.message}
        >
          {props.reloadable ? (
            <Button
              block
              hairline
              plain
              round
              size="small"
              type="primary"
              class="bottom-button"
              onClick={handleReload}
            >
              重新加载
            </Button>
          ) : null}
        </Empty>
      )
    }
    return () => {
      let content = null
      if (props.loading) {
        content = shouldShowLoading.value ? renderLoading() : <div />
      } else if (props.error) {
        content = renderError()
      } else if (props.empty) {
        content = renderEmpty()
      }
      return content ? (
        <div class="zt-loader">{content}</div>
      ) : (
        slots.default?.()
      )
    }
  },
})

Loader.error = error
Loader.defaultConfig = defaultConfig

export default Loader as typeof Loader & {
  readonly error: typeof error
  readonly defaultConfig: typeof defaultConfig
}
