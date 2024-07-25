<template>
  <div class="l7-base-form-items-container">
    <el-row v-bind="filterRowSettings">
      <template v-for="(settings, index) in filterKeySettings" :key="index">
          <el-col
            v-for="setting in settings"
            :key="setting.key"
            :xs="24"
            :sm="24"
            :lg="setting.span"
          >
            <el-form-item ref="elFormItemRefs" v-bind="setting.formItemAttrs" v-if="setting.visible">
              <!-- 覆盖原有 label 样式 -->
              <template v-slot:label>
                <div :class="['label-wrapper', { required: setting.formItemAttrs.required }]">
                  <div class="label">
                    <slot :name="`${setting.key}_label`">
                      {{ setting.formItemAttrs.label ? i18n.t(setting.formItemAttrs.label) : '' }}
                    </slot>
                  </div>
                  <div class="information">
                    <slot :name="`${setting.key}_information`"></slot>
                  </div>
                </div>
              </template>
              <template v-slot:default>
                <div class="value">
                  <slot :name="setting.key"></slot>
                </div>
              </template>
            </el-form-item>
          </el-col>
      </template>
    </el-row>
  </div>
</template>

<script setup>
  import useI18nModule from '@/hook/useI18nModule'
  import { computed, getCurrentInstance, reactive, ref, unref } from 'vue'
  import { deepClone } from '@/utils'
  const { i18nModule } = useI18nModule()
  const i18n = useI18n()
  const elFormItemRefs = ref([])

  const props = defineProps({
    rowSettings: {
      type: Object,
      default: () => ({})
    },
    keySettings: {
      required: true,
      type: Array,
      default: () => []
    },
    langRootKey: {
      type: String,
      default: ''
    }
  })

  const defaultRowSettings = reactive({
    gutter: 0,
    justify: 'start',
    align: 'middle',
    tag: 'div'
  })
  const defaultColSettings = reactive({
    span: 24,
    key: '',
    visible: true,
    formItemAttrs: {}
  })
  let filterRowSettings = ref({})
  let filterKeySettings = ref([])

  const langPath = computed(() => {
    // 设置语言基础路径
    // 优先级 props > parent custom component attrs > parent element-ui component attrs > i18n module
    return props.langRootKey || unref(i18nModule)
  })

  const assignByString = keyString => {
    return Object.assign({}, defaultColSettings, {
      key: keyString,
      formItemAttrs: {
        prop: keyString,
        label: `${unref(langPath)}${keyString}`,
        required: false,
        rules: []
      }
    })
  }
  const assginByObject = keyObject => {
    const { formItemAttrs, ...colAttrs } = keyObject
    // 先合并外层 col 配置
    const config = Object.assign({}, defaultColSettings, {
      ...colAttrs,
      // 再合并内层 form-item 配置
      formItemAttrs: Object.assign(
        {},
        {
          prop: colAttrs.key,
          label: `${unref(langPath)}${colAttrs.key}`,
          required: false,
          rules: []
        },
        formItemAttrs
      )
    })
    const { label, required, rules } = config.formItemAttrs
    if (required) {
      rules.unshift({
        required: true,
        message: `${i18n.t(label)}${i18n.t('rule.required')}`,
        trigger: ['change', 'blur']
      })
    }
    return config
  }

  const buildSettingsByString = array => {
    // 若 key 为字符串则使用默认配置
    return array.map(key => assignByString(key))
  }
  const buildSettingsByArray = array => {
    // 若 key 为字符串则使用默认配置，若 key 为对象则合并配置
    return array.map(key => (typeof key === 'string' ? assignByString(key) : assginByObject(key)))
  }
  const buildSettingsByObject = array => {
    // 若 key 为对象则合并配置
    return array.map(key => assginByObject(key))
  }
  const resetField = (field) => {
    for (let key in unref(filterKeySettings)) {
      let item = unref(filterKeySettings)[key]
      let formItemKey = item[0].key
      if (formItemKey === field) {
        unref(elFormItemRefs)[key].resetField()
      }
    }
  }

  watch(
    () => props.rowSettings,
    () => {
      // 合并 row 配置
      Object.assign(filterRowSettings.value, defaultRowSettings, props.rowSettings)
    },
    {
      deep: true,
      immediate: true
    }
  )
  watch(
    () => props.keySettings,
    () => {
      // 处理 key 配置
      const allSettings = deepClone(props.keySettings)
      filterKeySettings.value = allSettings.map(rowSettings => {
        const rowType = Object.prototype.toString.call(rowSettings)
        if (rowType === '[object String]') {
          return buildSettingsByString(rowSettings.split(','))
        } else if (rowType === '[object Array]') {
          return buildSettingsByArray(rowSettings)
        } else {
          return buildSettingsByObject(Array.of(rowSettings))
        }
      })
    },
    {
      deep: true,
      immediate: true
    }
  )

  defineExpose({ resetField })
</script>

<style lang="scss" scoped>
  .l7-base-form-items-container {
    max-height: calc(100vh - 54px - 62px - 10px);
    overflow-y: auto;
    overflow-x: hidden;
    :deep(.el-form-item__label) {
      justify-content: flex-start;
      width: 100%;
      padding: 0;
    }
    .label-wrapper {
      width: 100%;
      // margin-right: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: flex;
      align-items: center;
      .label {
        color: #303133;
      }
      .information {
        flex: 1;
        color: #999999;
        white-space: normal;
      }
    }
  }
  .required::before {
    content: '*';
    color: #fc4350;
  }
  .value {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    .el-select,
    .el-date-editor,
    .el-cascader {
      width: 100%;
    }
  }
</style>
