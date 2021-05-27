<template>
  {{ query }}
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    query: String,
  },
  setup(props) {
    console.log(props.query)
  }
})
</script>
