import eaxios, { CancelTokenSource } from '@openeagle/eaxios'
import { PropType, defineComponent, onUnmounted } from 'vue'
import { Uploader } from 'vant'
import { UploaderFileListItem } from 'vant/es/uploader'

function uploadFile(file: File, options: any): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        fileId: Date.now(),
        fileName: '',
        fileType: 'jped',
        meta: {
          format: 'jpeg',
          size: 0,
        },
        url: URL.createObjectURL(file),
      })
    }, 2000)
  })
}

export interface UploaderFile extends UploaderFileListItem {
  meta: {
    [key: string]: any
  }
}

export const UploaderProps = {
  ...Uploader.props,
  metadata: Function,
  onChange: Function as PropType<(value: UploaderFile[]) => void>,
}

export default defineComponent({
  name: 'EagUploader',
  props: UploaderProps,
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    let cancelToken: CancelTokenSource | undefined
    onUnmounted(() => {
      if (cancelToken) {
        cancelToken.cancel()
      }
    })
    const afterRead = (file: UploaderFile) => {
      if (file.file) {
        file.status = 'uploading'
        cancelToken = eaxios.CancelToken.source()
        return uploadFile(file.file, {
          cancelToken: cancelToken?.token,
          onUploadProgress: (event: any) => {
            if (event.total > 0) {
              event.percent = (event.loaded / event.total) * 100
            }
          },
        })
          .then((data) => {
            file.url = data.url
            if (typeof props.metadata === 'function') {
              props
                .metadata(file)
                .then((meta: any) => {
                  Object.assign(file, {
                    status: 'done',
                    meta,
                  })
                })
                .catch((error: Error) => {
                  file.status = 'failed'
                  file.message = error.message
                })
            } else {
              file.meta = data.meta
              file.status = 'done'
            }
          })
          .finally(() => {
            cancelToken = undefined
          })
      }
    }

    const handleChange = (fileList: UploaderFile[]) => {
      if (props.onChange) {
        props.onChange(fileList)
      }
      emit('update:modelValue', fileList)
    }

    return () => {
      const { metadata, ...restProps } = props
      return (
        <Uploader
          {...restProps}
          modelValue={props.modelValue}
          afterRead={afterRead as any}
          v-slots={slots}
          {...{
            'onUpdate:modelValue': handleChange,
          }}
        />
      )
    }
  },
})
