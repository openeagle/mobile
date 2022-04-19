import { defineComponent } from 'vue'
import { Cell, CellGroup } from 'vant'
import { useList, createRequest } from '@openeagle/mobile'
import classes from './index.module.less'

interface User {
  id: number
  name: string
}

export default defineComponent({
  setup() {
    const request = createRequest({
      baseURL:
        'https://www.fastmock.site/mock/1a5285177ca8c3a0663316c0642f3159/mobile',
      headers: { 'Content-Type': 'application/json' },
    })
    const userList = useList((page, { cancellation, ...options }) => {
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
    userList.refresh()

    const userListRefresh = () => {
      userList.refresh()
    }
    const userListLoadMore = () => {
      userList.loadMore()
    }

    return () => {
      return (
        <view class={classes.container}>
          <view class={classes.content}>
            <view class={classes.title}> 基础使用 </view>
            <button onClick={userListRefresh}>refresh</button>
            <button onClick={userListLoadMore}>load more</button>
            <CellGroup>
              <Cell
                title="refreshing"
                value={String(userList.state.refreshing)}
              />
              <Cell title="loading" value={String(userList.state.loading)} />
              <Cell title="hasMore" value={String(userList.state.hasMore)} />
              <Cell title="data" use-label-slot>
                {{
                  label: userList.state.data.map((item) => (
                    <div> {item.id + '/' + item.name} </div>
                  )),
                }}
              </Cell>
            </CellGroup>
          </view>
        </view>
      )
    }
  },
})
