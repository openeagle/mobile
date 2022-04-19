<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Cell, CellGroup } from 'vant'

const routes = [
  {
    name: 'components',
    children: [
      {
        name: 'ImageUploader',
        path: '/components/image-uploader',
      },
      {
        name: 'List',
        path: '/components/list',
      },
      {
        name: 'Loader',
        path: '/components/loader',
      },
      {
        name: 'NumberText',
        path: '/components/number-text',
      },
    ],
  },
  {
    name: 'hooks',
    children: [
      {
        name: 'useList',
        path: '/hooks/use-list',
      },
      {
        name: 'useToast',
        path: '/hooks/use-toast',
      },
    ],
  },
]
const router = useRouter()
const goto = (route: any) => {
  router.push(route.path)
}
</script>

<template>
  <CellGroup
    v-for="(route, routeIndex) in routes"
    :key="routeIndex"
    :title="route.name"
  >
    <Cell
      v-for="(childRoute, childRouteIndex) in route.children"
      :key="childRouteIndex"
      :title="childRoute.name"
      @click="goto(childRoute)"
    />
  </CellGroup>
</template>
