<script setup lang="ts">
import { ref } from 'vue'
import { ImageUploader } from '@openeagle/mobile'
import '@openeagle/mobile/components/ImageUploader/style'

const images = ref([])
</script>

<template>
  <div class="page">
    {{ JSON.stringify(images) }}
    <div class="demo">
      <ImageUploader v-model="images" :maxCount="5" uploadText="上传图片" />
    </div>
  </div>
</template>

<style scoped lang="less">
.page {
  background-color: #f5f6f6;
}

.demo {
  margin: 0 6.66vw;
  background-color: #fff;
}
</style>
