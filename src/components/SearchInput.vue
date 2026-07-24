<script setup lang="ts">
import { ref, watch } from 'vue'

import { debounce } from 'quasar'

interface Props {
  modelValue?: string
  placeholder?: string
  disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Введите город',
  disable: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'search', value: string): void
  (event: 'clear'): void
}>()

const searchValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (value) => {
    searchValue.value = value
  },
)

const handleSearch = debounce(() => {
  const city = String(searchValue.value || '').trim()
  if (!city) {
    return
  }
  emit('update:modelValue', city)
  emit('search', city)
}, 800)

function onEnter() {
  handleSearch()
}

function clearValue() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div class="search-input">
    <QInput
      v-model="searchValue"
      filled
      clearable
      :placeholder="placeholder"
      :disable="disable"
      @keyup.enter="onEnter"
      @update:model-value="handleSearch"
      @clear="clearValue"
    >
      <template #append>
        <QBtn round flat icon="search" @click="handleSearch" />
      </template>
    </QInput>
  </div>
</template>

<style scoped>
.search-input {
  width: 100%;

  max-width: 500px;
}
</style>
