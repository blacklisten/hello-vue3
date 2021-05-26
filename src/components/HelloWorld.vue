<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup() {
    const query = ref('')
    const count = ref(0)

    return {
      query,
      count
    }
  }
}
</script>
