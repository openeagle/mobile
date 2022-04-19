import { UnwrapRef, onBeforeUnmount, reactive } from 'vue'
import eaxios, {
  CancelTokenSource,
  EaxiosRequestConfig,
} from '@openeagle/eaxios'

export interface ListData<D, P = number> {
  data: D[]
  page: P
  hasMore: boolean
}

export interface ListState<D, P = number> extends ListData<D, P> {
  empty: boolean
  initiated: boolean
  loadError: any
  loading: boolean
  refreshError: any
  refreshing: boolean
}

export interface ListOption<D, P = number> {
  initiation?: Partial<ListData<D, P>>
  nextPage?: (state: ListData<D, P>) => P
}

export interface ListInstance<D, P = number> {
  state: UnwrapRef<ListState<D, P>>
  refresh(config?: Partial<EaxiosRequestConfig>): void
  loadMore(config?: Partial<EaxiosRequestConfig>): void
  cancel(): void
  reset(): void
}

const defaultPage = 1
const defaultHasMore = true
const defaultNextPage = (state: ListData<any>) => state.page + 1
const defaultOption: ListOption<any> = {
  initiation: {
    page: defaultPage,
    hasMore: defaultHasMore,
  },
  nextPage: defaultNextPage,
}

function useList<D = any, P = number>(
  request: (
    page: P,
    option: Partial<EaxiosRequestConfig>,
    data: ListState<D, P>
  ) => Promise<ListData<D, P>>,
  option: ListOption<D, P> = defaultOption as any
): ListInstance<D, P> {
  const initialData = option?.initiation?.data ?? []
  const initialPage = option?.initiation?.page ?? (defaultPage as any)
  const initialHasMore = option?.initiation?.hasMore ?? defaultHasMore

  const defaultState = (): ListState<D, P> => ({
    empty: false,
    initiated: false,
    data: initialData,
    page: initialPage,
    hasMore: initialHasMore,
    loadError: null,
    loading: false,
    refreshError: null,
    refreshing: false,
  })
  const state = reactive<ListState<D, P>>(defaultState())

  let lastRequestTime: number
  let refreshPromise: Promise<void> | null = null
  let refreshCancellation: CancelTokenSource | null = null
  let loadMorePromise: Promise<void> | null = null
  let loadMoreCancellation: CancelTokenSource | null = null
  const cancelTokenSource: CancelTokenSource | null = null
  // const cancelTokenSource: CancelTokenSource = eaxios.CancelToken.source();

  const refresh = (): Promise<void> => {
    if (state.refreshing || refreshPromise) {
      return refreshPromise || Promise.resolve()
    }
    if (loadMoreCancellation) {
      loadMoreCancellation.cancel()
      loadMorePromise = null
      loadMoreCancellation = null
    }
    lastRequestTime = Date.now()
    refreshCancellation = eaxios.CancelToken.source()
    state.refreshing = true
    refreshPromise = request(
      initialPage,
      {
        cancelToken: refreshCancellation.token,
      },
      state as ListState<D, P>
    )
      .then((result) => {
        state.empty = result.data.length === 0
        state.initiated = true
        state.data = result.data as any
        state.page = initialPage
        state.hasMore = result.hasMore
        state.refreshError = null
        state.refreshing = false
        state.loadError = null
      })
      .catch((error: any) => {
        if (!eaxios.isCancel(error)) {
          state.refreshError = error
        }
        state.refreshing = false
      })
      .finally(() => {
        refreshPromise = null
        refreshCancellation = null
      })
    return refreshPromise
  }

  const loadMore = () => {
    if (
      state.refreshing ||
      state.loading ||
      !state.hasMore ||
      loadMorePromise
    ) {
      return loadMorePromise || Promise.resolve()
    }
    state.loading = true
    const requestTime = Date.now()
    lastRequestTime = requestTime
    const nextPage = ((option.nextPage || defaultNextPage) as any)(state)
    loadMoreCancellation = eaxios.CancelToken.source()
    loadMorePromise = request(
      nextPage,
      {
        cancelToken: loadMoreCancellation.token,
      },
      state as ListState<D, P>
    )
      .then((result) => {
        if (requestTime === lastRequestTime) {
          state.data = state.data.concat(result.data as any)
          state.page = nextPage
          state.hasMore = result.hasMore
          state.loadError = null
          state.loading = false
        }
      })
      .catch((error: any) => {
        if (!eaxios.isCancel(error)) {
          state.loadError = error
        }
        state.loading = false
      })
      .finally(() => {
        loadMorePromise = null
        loadMoreCancellation = null
      })
    return loadMorePromise
  }

  const cancel = () => {
    if (refreshCancellation) {
      refreshCancellation?.cancel()
    }
    if (loadMoreCancellation) {
      loadMoreCancellation.cancel()
    }
  }

  const reset = () => {
    cancel()
    Object.assign(state, defaultState())
  }

  onBeforeUnmount(() => {
    cancel()
  })

  return {
    state,
    refresh,
    loadMore,
    cancel,
    reset,
  }
}

export default useList
