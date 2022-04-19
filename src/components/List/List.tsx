import { EaxiosError } from '@openeagle/eaxios'
import { computed, defineComponent, PropType, watch } from 'vue'
import { PullRefresh, List as VanList, Toast } from 'vant'
import Loader from '../Loader'

export type ListRefreshStyle = 'pulling' | 'loader'

export type ListRefreshMode = 'auto' | ListRefreshStyle

const List = defineComponent({
  name: 'EagList',
  props: {
    /** 列表数据 */
    data: {
      type: Array as PropType<Record<string, any>[]>,
      default: () => [],
      required: false,
    },
    /** 初始化之前数据是空的，这个时候组件内部无法区分是空还是未初始化 */
    empty: { type: Boolean, default: false, required: false },
    /** 是否有更多数据 */
    hasMore: Boolean,
    /** 是否启用下拉刷新 */
    refresherEnabled: {
      type: Boolean,
      default: true,
      required: false,
    },
    /**
     * 刷新模式
     *
     * - auto：自动跟进数据来处理，有数据使用 pulling，否则 loader
     * - pulling：下拉刷新
     * - loader：加载器
     */
    refresherMode: {
      type: String as PropType<ListRefreshMode>,
      default: 'auto',
    },
    /** 触发下拉刷新的距离 */
    refresherThreshold: {
      type: Number,
      default: undefined,
      required: false,
    },
    refresherToast: {
      type: Boolean,
      default: true,
      required: false,
    },
    /** 是否初始化或下拉刷新 */
    refreshing: {
      type: Boolean,
      default: false,
      required: false,
    },
    /** 初始化或下拉刷新错误 */
    refreshError: {
      type: [Boolean, Object] as PropType<Error | EaxiosError>,
      required: false,
    },
    /** 滚动条与底部距离小于 offset 时触发 load 事件 */
    loaderThreshold: {
      type: Number,
      default: undefined,
      required: false,
    },
    /** 是否处于加载状态，加载过程中不触发 load 事件 */
    loading: {
      type: Boolean,
      default: false,
      required: false,
    },
    /** 加载过程中的提示文案 */
    loadingText: {
      type: String,
      default: '加载中...',
      required: false,
    },
    /** 加载失败信息 */
    loadError: {
      type: [Boolean, Object] as PropType<null | Error | EaxiosError>,
      default: null,
      required: false,
    },
    /** 加载失败后的提示文案 */
    loadErrorText: {
      type: String,
      default: '请求失败，点击重新加载',
      required: false,
    },
    /** 加载完成后的提示文案 */
    loadFinishedText: {
      type: String,
      default: '暂无更多数据',
      required: false,
    },
  },
  emits: ['refresh', 'load'],
  setup(props, { slots, emit }) {
    const refresherStyle = computed<ListRefreshStyle>(() => {
      if (props.refresherMode === 'auto') {
        return props.data.length === 0 ? 'loader' : 'pulling'
      }
      return props.refresherMode
    })
    const handleRefresh = () => {
      emit('refresh')
    }
    const handleLoad = () => {
      emit('load')
    }
    watch(
      () => props.refreshError,
      () => {
        if (
          refresherStyle.value === 'pulling' &&
          props.refresherToast &&
          props.refreshError?.message
        ) {
          Toast.fail(props.refreshError.message)
        }
      }
    )
    const renderLoader = () => {
      return slots.loader ? (
        slots.loader()
      ) : (
        <Loader
          empty={props.empty}
          error={props.refreshError}
          loading={props.refreshing}
          onReload={handleRefresh}
        />
      )
    }
    const listSlots = computed(() => {
      const renderDefault = () => {
        return (
          <>
            {slots.header?.()}
            {refresherStyle.value === 'loader' ? renderLoader() : null}
            {slots.default?.()}
          </>
        )
      }
      if (slots.more) {
        return {
          default: renderDefault,
          loading: () => slots.more?.(),
          finished: () => slots.more?.(),
          error: () => slots.more?.(),
        }
      }
      return {
        default: renderDefault,
      }
    })
    return () => {
      return (
        <PullRefresh
          modelValue={refresherStyle.value === 'pulling' && props.refreshing}
          disabled={
            refresherStyle.value !== 'pulling' || !props.refresherEnabled
          }
          pullDistance={props.refresherThreshold}
          onRefresh={handleRefresh}
        >
          <VanList
            loading={props.loading}
            loadingText={props.loadingText}
            error={!!props.loadError}
            errorText={props.loadErrorText}
            finished={!props.hasMore}
            finishedText={props.loadFinishedText}
            offset={props.loaderThreshold}
            immediateCheck={true}
            onLoad={handleLoad}
            v-slots={listSlots.value}
            {...{
              'onUpdate:error': handleLoad,
            }}
          />
        </PullRefresh>
      )
    }
  },
})

export default List
