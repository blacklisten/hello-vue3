<template>
  <el-select
    v-scroll="handleScroll"
    v-model="value"
    v-bind="$attrs"
    :multiple="multiple"
    :disabled="disabled"
    :clearable="clearable"
    :placeholder="placeholder"
    :filterable="filterable"
    :collapse-tags="collapseTags"
    :multiple-limit="multipleLimit"
    :allow-create="allowCreate"
    :filter-method="filterMethod"
    :loading="loading"
    :loading-text="loadingText"
    :remote="remote"
    :remote-method="remoteMethod || remoteFunc"
    @change="change"
    @clear="$emit('clear')"
    @visible-change="visibleChange"
    @remove-tag="removeTag"
  >
    <el-option
      v-for="(item, index) in optionDatas"
      :key="optionKey ? item[optionKey] : index"
      :label="item[optionLabel]"
      :value="item[optionValue]"
    >
      <slot />
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { reactive, defineComponent, PropType, toRefs, computed } from 'vue'

enum OptionStatusEnum {
  Default,
  Up,
  Down
}

interface AjaxDataFunc {
  ({
    pageIndex,
    pageSize,
    searchText
  }: { pageIndex?: number; pageSize?: number; searchText?: string }): Promise<Array<any>>;
}
interface PageOptions {
  pageIndex: number;
  pageLimit: number;
  pageSize: number;
}

export default defineComponent({
  model: '',
  props: {
    // el-select Props
    modelValue: { type: [ String, Number, Boolean, Array ], default: '' },
    multiple: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    placeholder: { type: String, default: '请选择...' },
    filterable: { type: Boolean, default: false },
    collapseTags: { type: Boolean, default: false },
    multipleLimit: { type: Number, default: 0 },
    allowCreate: { type: Boolean, default: false },
    filterMethod: { type: Function },
    loading: { type: Boolean, default: false },
    loadingText: { type: String, default: '加载中...' },
    remote: { type: Boolean, default: false },
    remoteMethod: { type: Function },
    // el-option Props
    optionValue: { type: [ String, Number, Object ], default: 'value' },
    optionLabel: { type: [ String, Number ], default: 'label' },
    optionKey: { type: [ String, Number, Object ] },
    // select-datas Props
    ajaxData: { type: Function, required: true },
    isInitRequest: { type: Boolean, default: false },
    defaultPageOptions: { type: Object as PropType<PageOptions>, default: () => {
      return {
        pageIndex: 1,
        pageLimit: 1,
        pageSize: 50
      }
    } }
  },

  directives: {
    scroll: {
      mounted (el: HTMLElement, binding) {
        // 获取滚动页面DOM
        const SCROLL_DOM = document.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        let scrollPosition = 0
        SCROLL_DOM?.addEventListener('scroll', function () {
          // 当前的滚动位置 减去  上一次的滚动位置
          // 如果为true则代表向上滚动，false代表向下滚动
          const flagToDirection = SCROLL_DOM.scrollTop - scrollPosition > 0
          // 记录当前的滚动位置
          scrollPosition = SCROLL_DOM.scrollTop
          const LIMIT_BOTTOM = SCROLL_DOM.scrollHeight / 4.2
          // 记录滚动位置距离底部的位置
          const scrollBottom = SCROLL_DOM.scrollHeight - (SCROLL_DOM.scrollTop + SCROLL_DOM.clientHeight) < LIMIT_BOTTOM
          // 如果向下滚动 并且距离底部只有100px
          if (flagToDirection && scrollBottom) {
            // 将滚动行为告诉组件
            binding.value(flagToDirection, SCROLL_DOM, SCROLL_DOM.scrollHeight / 2)
          }
          // 如果是向上滚动  并且距离顶部只有100px
          if (!flagToDirection && SCROLL_DOM.scrollTop < LIMIT_BOTTOM) {
            binding.value(flagToDirection, SCROLL_DOM, SCROLL_DOM.scrollHeight / 2)
          }
        })
      }
    }
  },

  setup({ modelValue, isInitRequest, defaultPageOptions, ajaxData }, { emit }) {
    const state = reactive({
      optionDatas: [] as any[],
      modelValue
    })

    let pageMap = [] as number[]
    let status = OptionStatusEnum.Default
    let pageOptions = {
      pageIndex: 1,
      pageLimit: 1,
      pageSize: 50
    } as PageOptions
    let searchText = ''

    const value = computed({
      get: () => {
        return state.modelValue
      },
      set: (value) => {
        state.modelValue = value
        modelValue = value
      }
    })

    const initFunc = () => {
      if (!isInitRequest) return
      pageOptions = { ...defaultPageOptions } as any
      pageMap.push(pageOptions.pageIndex)
    }

    const handleScroll = (param: boolean, el: HTMLElement, middlePosition: number) => {
      if (param) {
        if (pageMap.length >= pageOptions.pageLimit) {
          // 当长度相等的时候， 绝对不能超出长度  则有进必有出
          // 删除 pageMap 列表的第一个元素
          pageMap.shift()
          // 对应删除list中一页的数据量
          state.optionDatas.splice(0, pageOptions.pageSize)
          // 回滚到中间位置
          el.scrollTop = middlePosition
        }
        ++pageOptions.pageIndex
        pageMap.push(pageOptions.pageIndex)
        // 请求下一页数据
        status = OptionStatusEnum.Down
        ajaxFunc()
      } else {
        // 如果在向上滚动时，如果还没有到达第一页则继续加载。 如果已到达则停止加载
        if (pageMap[0] > 1) {
          // 向上滚动，取出pageMap中第一个元素值减1
          pageOptions.pageIndex = pageMap[0] - 1
          // 同步设置分页
          // ①先删除最后一个元素
          pageMap.pop()
          // ②将新元素添加在头部
          pageMap = [ pageOptions.pageIndex, ...pageMap ]
          // ①删除list中最后一页的数据
          state.optionDatas.splice(-pageOptions.pageSize, pageOptions.pageSize)
          status = OptionStatusEnum.Up
          ajaxFunc()
          // 回滚到中间位置
          el.scrollTop = middlePosition
        } else {
          return false
        }
      }
    }

    const remoteFunc = (query: string) => {
      pageOptions = { ...defaultPageOptions }
      searchText = query
      status = OptionStatusEnum.Default
      ajaxFunc()
    }

    const ajaxFunc = () => {
      ajaxData({
        pageIndex: pageOptions.pageIndex,
        pageSize: pageOptions.pageSize,
        searchText: searchText
      }).then((result: any[]) => {
        if (status === OptionStatusEnum.Default) {
          state.optionDatas = []
          state.optionDatas = result
        } else if (status === OptionStatusEnum.Up) {
          // 将新数据添加在头部位置'
          state.optionDatas = [...result, ...state.optionDatas]
        } else {
          state.optionDatas.push(...result)
        }
      })
    }

    const change = (select: any) => emit('change', select)
    const visibleChange = (status: boolean) => emit('visible-change', status)
    const removeTag = (tag: any) => emit('remove-tag', tag)
    const clear = () => emit('clear')

    initFunc()

    return {
      value,
      ...toRefs(state),
      handleScroll,
      remoteFunc,
      change,
      visibleChange,
      removeTag,
      clear
    }
  }
})
</script>
