import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/createUser',
    method: 'post',
    response: ({ body }: any) => {
      console.log('body----', body)
      return { 
        code: 200,
        message: 'success',
        data: {
          userName: 'ZhangSan',
          userId: '1'
        }
      }
    }
  }
] as MockMethod[]
