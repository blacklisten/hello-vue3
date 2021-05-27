import { InjectionKey } from 'vue'
import { Store, createStore } from 'vuex'

export interface State {
  count: number
}
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state() {
    return {
      count: 0
    }
  },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})
