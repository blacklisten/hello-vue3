import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

import userMock from '../mock/user'

const mocks = [...userMock]
export function setupProdMockServer() {
  createProdMockServer(mocks)
}
