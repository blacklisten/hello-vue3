<template>
  {{ query }}
  <el-button @click="changeOptions">reactive</el-button> {{ options }}
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  props: {
    query: String,
  },
  setup(props) {
    const state = reactive({
      options: [] as any[]
    })
    const changeOptions = () => {
      const result = [
        { label: 'test', value: 1 }
      ]
      state.options.push(...result)
    }
    return {
      ...toRefs(state),
      changeOptions
    }
  }
})
</script>
