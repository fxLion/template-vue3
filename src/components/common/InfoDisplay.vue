<template>
  <div class="info-detail" v-if="filterFields.length">
    <el-row>
      <el-col v-for="(field, index) in filterFields" :span="fieldSpan" :key="index" class="list-item">
        <el-row>
          <el-col :span="8">
            <div class="item-label">
              <slot :name="`label_${field}`">{{ $t(langRootKey + field) }}</slot>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="item-value">
              <slot :name="`value_${field}`" :row="baseData">
                {{ filterValue(baseData[field]) }}
              </slot>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    baseData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    fieldSpan: {
      type: [String, Number],
      default: 12
    },
    showFields: {
      type: Array,
      default: function () {
        return []
      }
    },
    langRootKey: {
      type: String,
      default: ''
    },
    allowEmpty: {
      type: Boolean,
      default: true
    }
  })
  const filterFields = computed(() => {
    return props.showFields.length ? props.showFields : Object.keys(filterEmpty(props.baseData))
  })
  const filterValue = val => {
    if (val === '' || val === undefined || val === null) {
      return '-'
    }
    return val
  }
  const filterEmpty = object => {
    if (props.allowEmpty) return object
    let newObject = {}
    for (const key in object) {
      if (Object.hasOwnProperty.call(object, key) && object[key] !== null) {
        newObject[key] = object[key]
      }
    }
    return newObject
  }
</script>

<style lang="scss" scoped>
  .info-detail {
    margin-top: 10px;
    font-size: 14px;
    .list-item {
      margin: 5px 0;
    }
    .item-label {
      text-align: right;
      font-weight: 400;
      color: #4d4e50;
      margin-right: 20px;
      word-wrap: break-word;
    }
    .item-value {
      height: 100%;
      display: flex;
      align-items: center;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
</style>
