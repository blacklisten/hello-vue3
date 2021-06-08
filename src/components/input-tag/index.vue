<template>
  <div
    :class="{
      'input-tag_wrapper--readonly': readonly,
      'input-tag_wrapper--active': isInputActive
    }"
    :style="{ width: width + 'px' }"
    class="input-tag_wrapper"
    @click="focusNewTag"
  >
    <el-tag
      v-for="(tag, index) in innerTags"
      :key="index"
      class="input-tag"
      :closable="!readonly"
      :type="type"
      @close="removeTag(tag, index)"
    >
      {{ tag }}
    </el-tag>
    <el-input
      v-if="!readonly"
      ref="input_tag_ref"
      v-model="newTag"
      class="new-tag"
      :placeholder="placeholder"
      :validate-event="false"
      @keyup.enter.stop="addNew"
      @keyup.delete.stop="removeLastTag"
      @blur="handleInputBlur"
      @focus="handleInputFocus"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, PropType } from 'vue'

enum InputTagStatusEnum {
  'REPEAT' = 'repeat',
  'VALIDATE' = 'validate'
}

export default defineComponent({
  props: {
    // el-tag 组件 props
    type: { type: String, default: '' },
    // el-input 组件 props
    placeholder: { type: String, default: '请输入...' },
    readonly: { type: Boolean, default: false },
    // input-tag 组件 props
    value: {  type: Array as PropType<string[]>, default: () => [] },
    width: { type: Number, default: 300 },
    isReplaceRepeat: { type: Boolean, default: false },
    validate: { type: [RegExp, Function], default: () => {} }
  },
  setup({ value, validate, isReplaceRepeat, readonly }, { emit }) {
    const newTag = ref('')
    const previousTag = ref('') // 用于判断是否需要给出 message 提示
    const innerTags: Array<string> = reactive([...value])
    const isInputActive = ref(false)
    const input_tag_ref = ref<HTMLInputElement | null>(null)

    const addNew = () => {
      console.log(newTag.value)
      if (!newTag.value) return
      if (validate) {
        const isValid = validateIfNeeded()
        if (!isValid) {
          if (previousTag.value !== newTag.value) {
            emit('message', {
              status: InputTagStatusEnum.VALIDATE,
              tag: newTag.value
            } as InputTagMessageOption)
            previousTag.value = newTag.value
          }
          return
        }
      }
      if (isReplaceRepeat && innerTags.length) {
        const isFindValue = innerTags.find((tag) => tag === newTag.value)
        if (isFindValue) {
          if (previousTag.value !== newTag.value) {
            emit('message', {
              status: InputTagStatusEnum.REPEAT,
              tag: newTag.value
            } as InputTagMessageOption)
            previousTag.value = newTag.value
          }
          return
        }
      }
      innerTags.push(newTag.value)
      newTag.value = ''
      previousTag.value = ''
      tagChange()
    }

    const validateIfNeeded = () => {
      if (typeof validate === 'function') {
        return validate(newTag.value)
      }

      return validate.test(newTag.value)
    }

    const handleInputFocus = () => {
      isInputActive.value = true
    }

    const handleInputBlur = () => {
      isInputActive.value = false
      addNew()
    }

    const focusNewTag = () => {
      if (readonly) {
        return
      }
      input_tag_ref.value?.focus()
    }

    const removeTag = (tag: string, index: number) => {
      innerTags.splice(index, 1)
      tagChange()
    }

    const removeLastTag = () => {
      if (newTag.value || previousTag.value) {
        if (!newTag.value) {
          previousTag.value = ''
        }
        return
      }
      innerTags.pop()
      tagChange()
    }

    const tagChange = () =>{
      emit('input', innerTags)
    }

    return {
      newTag,
      previousTag,
      innerTags,
      isInputActive,
      input_tag_ref,
      addNew,
      handleInputFocus,
      handleInputBlur,
      focusNewTag,
      removeTag,
      removeLastTag
    }
  },
})
</script>

<style lang="scss" scoped>
.input-tag_wrapper {
  display: flex;
  width: 100%;
  padding: 3px 6px;
  overflow: hidden;
  font-size: inherit;
  color: #606266;
  cursor: text;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  -webkit-appearance: none;
  flex-wrap: wrap;
  align-items: center;
  .input-tag {
    position: relative;
    height: auto;
    padding-right: 18px;
    margin: 3px;
    word-break: break-all;
    word-wrap: break-word;
    white-space: normal;
    .el-icon-close {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translate(0%, -50%);
    }
  }
  .new-tag {
    width: 50px;
    flex-grow: 1;
    input {
      padding: 0 6px;
      border: none;
    }
  }
}
.input-tag_wrapper--readonly {
  cursor: default;
}
.input-tag_wrapper--active {
  border-color: #409eff;
}
</style>
