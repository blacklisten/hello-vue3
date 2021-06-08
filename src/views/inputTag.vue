<template>
  <input-tag @input="changeTags" @message="messageFunc" :validate="validate" isReplaceRepeat></input-tag>
  <input-tag :value="value" readonly type="warning" :width="500"></input-tag>
</template>

<script setup lang="ts">
import inputTag from '../components/input-tag/index.vue'

const value = ['ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', '1223']
const validate = /^[a-zA-Z]+$/

const changeTags = (tags: string[]) => {
  console.log(tags)
}

const messageFunc = (msg: InputTagMessageOption) => {
  console.log(msg)
}
</script>

