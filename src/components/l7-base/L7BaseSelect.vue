<template>
  <el-select v-bind="$attrs" :placeholder="props.placeholder ? props.placeholder : $t('placeholder.select')" clearable>
    <el-option
      v-for="(item, index) in filterOption"
      :key="index"
      :label="item[labelKey]"
      :value="item[valueKey]"
      :disabled="item.disabled"
    >
      <slot name="option-item" :row="item"></slot>
      <template #loading>
        <svg class="circular" viewBox="0 0 50 50">
          <circle class="path" cx="25" cy="25" r="20" fill="none" />
        </svg>
      </template>
    </el-option>
  </el-select>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    options: {
      type: Array,
      default() {
        return []
      }
    },
    labelKey: { type: String, default: 'label' },
    valueKey: { type: String, default: 'value' },
    placeholder: { type: String, default: '' }
  })

  const filterOption = computed(() => {
    let _options = []
    props.options.forEach(item => {
      let option = typeof item == 'object' ? item : { label: item, value: item }
      _options.push(option)
    })
    return _options
  })
</script>
