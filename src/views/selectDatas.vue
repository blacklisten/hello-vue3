<template>
  <h2>basic: </h2>
  <select-datas v-model='value1' filterable clearable :loading="loading" remote :ajaxData="ajaxData" @change="changeData" @visible-change="visibleChange" @clear="clear"></select-datas>
  <h2>multiple: </h2>
  <select-datas v-model='value2' multiple isInitRequest filterable :loading="loading" remote :ajaxData="ajaxData" @change="changeData" @remove-tag="removeTag"></select-datas>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import selectDatas from '../components/select-datas/index.vue'

const createOptions = () => {
  const options = []
  for (let i = 0; i < 1000; i++) {
    options.push({
      value: i,
      label: '选项' + i
    })
  }
  return options
}

const options = createOptions()
const pageIndex = 1
const loading = ref(false)
const value1 = ref('')
const value2 = reactive([0, 1])

const ajaxData = ({ pageIndex, pageSize, searchText }: { pageIndex: number, pageSize: number, searchText: string }) => {
  loading.value = true
  const datas = searchDatas(searchText)
  const length = pageSize * pageIndex > datas.length ? datas.length : pageSize * pageIndex
  return new Promise((resolve, reject) => {
    try {
      const list = []
      for (let i = pageSize * (pageIndex - 1); i < length; i++) {
        list.push(datas[i])
      }
      setTimeout(() => {
        loading.value = false
      }, 1000)
      return resolve(list || [])
    } catch(e) {
      console.log(e)
      return resolve([])
    }
  })
}

const searchDatas = (searchText: string) => {
  return options.filter((option) => {
    return option.label.includes(searchText)
  })
}

const changeData = (select: any) =>  {
  // console.log(select)
}
const visibleChange = (status: boolean)  => {
  // console.log(status)
}
const removeTag = (tag: any) => {
  // console.log(tag)
}
const clear = () => {
  console.log('clear')
}
</script>