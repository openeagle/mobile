<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { Cell, CellGroup } from 'vant'
import eaxios, { EaxiosError } from '@openeagle/eaxios'
import { Loader } from '@openeagle/mobile'
import '@openeagle/mobile/components/Loader/style'

const state = reactive<{
  error?: EaxiosError
  loading: boolean
}>({
  error: undefined,
  loading: false,
})
const load = (timeout = 3000) => {
  state.loading = true
  setTimeout(() => {
    state.error = undefined
    state.loading = false
  }, timeout)
}
const fail = (code = 'UNKNOWN') => {
  state.loading = true
  setTimeout(() => {
    state.error = eaxios.createError(code, code, {} as any)
    state.loading = false
  }, 1000)
}
onMounted(() => {
  load(1000)
})
</script>

<template>
  <Loader :error="state.error" :loading="state.loading" @reload="load">
    <CellGroup title="加载中">
      <Cell title="重新加载" isLink @click="load(3000)" />
      <Cell title="短暂加载" isLink @click="load(200)" />
    </CellGroup>
    <CellGroup title="加载失败">
      <Cell title="unkown" isLink @click="fail('UNKNOWN')" />
      <Cell title="aborted" isLink @click="fail('REQUEST_ABORTED')" />
      <Cell title="offline" isLink @click="fail('REQUEST_OFFLINE')" />
      <Cell title="timeout" isLink @click="fail('REQUEST_TIMEOUT')" />
      <Cell title="error" isLink @click="fail('SERVER_ERROR')" />
    </CellGroup>
  </Loader>
</template>
