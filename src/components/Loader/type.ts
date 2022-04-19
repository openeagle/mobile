type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

export interface LoaderErrorConfig {
  image: 'default' | 'error' | 'network' | 'search' | string
  message: string
}

export interface LoaderConfig {
  loading: {
    image: 'circular' | 'spinner'
    message: string
  }
  empty: LoaderErrorConfig
  error: {
    [
      key:
        | 'UNKNOWN'
        | 'REQUEST_ABORTED'
        | 'REQUEST_OFFLINE'
        | 'REQUEST_TIMEOUT'
        | 'SERVER_ERROR'
        | 'RESPONSE_INVALID'
        | string
    ]: LoaderErrorConfig
  }
}

export type LoaderOption = RecursivePartial<LoaderConfig>
