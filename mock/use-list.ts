import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/use-list',
    method: 'post',
    response: (req) => {
      const pageIndex = Number(req.body.pageIndex || '1')
      const pageSize = 16
      const code = pageIndex < 10 ? 10000 : 10001
      return {
        code,
        body: {
          [`userArray|${pageSize}`]: [
            {
              'id|+1': (pageIndex - 1) * pageSize + 1,
              name: '@cname',
            },
          ],
          hasMoreUser: pageIndex <= 3,
        },
      }
    },
  },
] as MockMethod[]
