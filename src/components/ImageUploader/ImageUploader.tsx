import { defineComponent, ref, watchEffect } from 'vue'
import { Icon } from 'vant'
import Uploader, { UploaderFile, UploaderProps } from '../Uploader'

export const ImageUploaderProps = {
  ...(() => {
    const { metadata, ...restProps } = UploaderProps
    return restProps
  })(),
  gutter: {
    type: Number,
    default: 5,
  },
}

export default defineComponent({
  name: 'EagImageUploader',
  props: ImageUploaderProps,
  setup(props, { emit, slots }) {
    const dom = ref<HTMLElement>()
    watchEffect(
      () => {
        if (dom.value) {
          dom.value.style.setProperty(
            '--gutter-horizontal',
            `${Math.floor((props.gutter / 3.75 / 2) * 100) / 100}vw`
          )
          dom.value.style.setProperty(
            '--gutter-vertical',
            `${Math.floor((props.gutter / 3.75) * 100) / 100}vw`
          )
        }
      },
      {
        flush: 'post',
      }
    )

    const handleChange = (fileList: UploaderFile[]) => {
      if (props.onChange) {
        props.onChange(fileList)
      }
      emit('update:modelValue', fileList)
    }

    const handleDelete = (index: number) => {
      const fileList = props.modelValue.slice(0)
      fileList.splice(index, 1)
      emit('update:modelValue', fileList)
    }

    const renderAddition = () => {
      return (
        <div class="openeagle-image-uploader-addition__btn">
          <Icon class="openeagle-image-uploader-addition__icon" name="plus" />
          {props.uploadText ? (
            <div class="openeagle-image-uploader-addition__text">
              {props.uploadText}
            </div>
          ) : null}
          {props.maxCount && props.maxCount !== Number.MAX_VALUE ? (
            <div class="openeagle-image-uploader-addition__tip">
              {`（最多${props.maxCount}张）`}
            </div>
          ) : null}
        </div>
      )
    }

    const renderCover = (file: UploaderFile & { index: number }) => {
      return (
        <Icon
          class="openeagle-image-uploader-addition__delete"
          name="cross"
          onClick={(event) => {
            event.stopPropagation()
            handleDelete(file.index)
          }}
        />
      )
    }

    return () => {
      const { gutter, ...restProps } = props
      return (
        <div ref={dom}>
          <Uploader
            class="openeagle-image-uploader"
            previewSize="28vw"
            {...restProps}
            deletable={false}
            modelValue={props.modelValue}
            {...{
              'onUpdate:modelValue': handleChange,
            }}
            v-slots={{
              default: slots.default ? () => slots.default?.() : renderAddition,
              'preview-cover': renderCover,
            }}
          />
        </div>
      )
    }
  },
})
