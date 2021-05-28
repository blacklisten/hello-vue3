<template>
  <button @click="inCrement">count is: {{ count }}</button>
  <el-input v-model="query" />
  {{ query }}
  <el-button @click="resetQuery">clear query</el-button>
  <search-results :query="query"></search-results>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '../store'
import SearchResults from '../components/SearchResults.vue'
import { ElInput, ElButton } from 'element-plus'
import axios from 'axios'

export default defineComponent({
  name: 'HelloWorld',
  components: {
    'search-results': SearchResults,
    'el-input': ElInput,
    'el-button': ElButton
  },
  setup() {
    const store = useStore(key)
    const query = ref('')
    const resetQuery = _ => {
      query.value = ''
    }

    const count = computed(() => store.state.count)

    return {
      query,
      resetQuery,
      count,
      inCrement: () => store.commit('increment')
    }
  },
  mounted() {
    axios.post('/api/createUser', {
      name: 'vben',
      gender: 'man',
    }).then(({ data }) => {
      console.log(data)
    })
  }
})
</script>
