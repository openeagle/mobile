<script setup lang="ts">
import { onMounted } from 'vue'
import { Cell } from 'vant'
import { List, createRequest, useList } from '@openeagle/mobile'
import '@openeagle/mobile/components/List/style'

interface User {
  id: number
  name: string
}

const request = createRequest({
  baseURL:
    'https://www.fastmock.site/mock/1a5285177ca8c3a0663316c0642f3159/mobile',
  headers: { 'Content-Type': 'application/json' },
})
const userList = useList((page, options) => {
  return request<{ userArray: User[]; hasMoreUser: boolean }>({
    ...options,
    method: 'post',
    url: '/api/use-list',
    data: {
      pageIndex: page,
    },
  }).then(({ userArray, hasMoreUser }) => {
    return {
      data: userArray,
      page,
      hasMore: hasMoreUser,
    }
  })
})

onMounted(() => {
  userList.refresh()
})
</script>

<template>
  <List
    :data="userList.state.data"
    :empty="userList.state.empty"
    :hasMore="userList.state.hasMore"
    :refresherToast="true"
    :refreshing="userList.state.refreshing"
    :refreshError="userList.state.refreshError"
    :loading="userList.state.loading"
    :loadError="userList.state.loadError"
    @refresh="userList.refresh"
    @load="userList.loadMore"
  >
    <Cell v-for="item in userList.state.data" :key="item.id">{item.name}</Cell>
  </List>
</template>
