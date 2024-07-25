<template>
    <div class="key-value-container">
        <el-row :gutter="10">
            <template v-for="(keySetting, index) in filterKeySettings" :key="index">
                <el-col
                    :xs="24"
                    :sm="24"
                    :lg="keySetting.span"
                >
                    <div class="key-value-item">
                        <slot :name="keySetting.key" :row="baseModel">
                            <el-input v-model="baseModel[keySetting.key]" clearable :placeholder="$t(keySetting.placeholder)"></el-input>
                        </slot>
                    </div>
                </el-col>
            </template>
        </el-row>
    </div>
</template>

<script setup>
import { deepClone } from '@/utils'
import useI18nModule from '@/hook/useI18nModule'
const { i18nModule } = useI18nModule()

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
        required: true
    },
    separator: {
        type: String,
        default: ':'
    },
    options: {
        type: Object, 
    },
    rowSettings: {
        type: Object,
        default: () => ({})
    },
    keySettings: {
        type: Array,
        required: true,
        default: () => []
    },
    langRootKey: {
      type: String,
      default: ''
    }
})

const emits = defineEmits(['update:modelValue'])

const langPath = computed(() => {
    // 设置语言基础路径
    // 优先级 props > parent custom component attrs > parent element-ui component attrs > i18n module
    return props.langRootKey || unref(i18nModule)
  })


const defaultRowSettings = reactive({
    gutter: 10,
    justify: 'start',
    align: 'middle',
    tag: 'div'
  })

const defaultColSettings = {}
const defaultKeySettings = {
    key: '',
    visiable: true,
    xs: 12,
    sm: 12,
    lg: 12,
    span: 12,
    keyAttrs: {}
}

const baseModel = reactive({})

let filterRowSettings = ref([])
let filterKeySettings = ref([])

watch(() => props.rowSettings, (value) => {
    // 合并 row 配置
    Object.assign(filterRowSettings.value, defaultRowSettings, props.rowSettings)
}, {deep: true, immediate: true})


watch(() => props.keySettings, () => {
    const allSettings = deepClone(props.keySettings)
    let values = props.modelValue ? props.modelValue.split(props.separator) : []
    let span = Math.floor(24 / allSettings.length)
    filterKeySettings.value = allSettings.map((key, index) => {
        baseModel[key] = values[index] || ''
        return {
            key: key,
            span: span,
            placeholder: `${unref(langPath)}${key}`
        }
    })
}, {
    immediate: true,
    deep: true
})

watch(baseModel, (value) => {
    let list = []
    let realValue = ''
    for (let key in baseModel) {
        list.push(baseModel[key])
    }
    realValue = list.join(props.separator) === props.separator ? '' : list.join(props.separator)
    emits('update:modelValue', realValue)
})

</script>
<style scoped lang="scss">
</style>