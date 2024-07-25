<template>
    <div class="advanced-query" :class="{'advanced-query-border': props.border}">
        <div class="field">
            <template v-if="fieldOrValue.editing">
                <span class="field-label">{{ $t(fieldOrValue.fieldLabel) }}</span>
            </template>
            <template v-else>
                <el-select v-model="fieldOrValue.fieldValue" :placeholder="$t('placeholder.select')" @change="handleFieldChange" clearable :size="props.size" filterable>
                    <el-option v-for="item in fieldsOptions" :key="`field-${item.value}`" :label="$t(item.label)" :value="item.value"></el-option>
                </el-select>
            </template>
        </div>
        <div class="value">
            <slot name="value" :base="fieldOrValue">
               <el-select v-if="fieldOrValue.valueType ==='select'" v-model="fieldOrValue.value" :placeholder="$t('placeholder.select')" @change="handleValueChange" clearable :size="props.size" filterable>
                    <el-option v-for="item in fieldOrValue.valueOptions" :key="`value-${item[fieldOrValue.optionsValue]}`" :label="item[fieldOrValue.optionsLabel]" :value="item[fieldOrValue.optionsValue]"></el-option>
                </el-select>
                <el-input v-else v-model="fieldOrValue.value" :placeholder="$t('placeholder.input')" :size="props.size" @change="handleValueChange"></el-input>
            </slot>
        </div>
        <div class="operator">
            <slot name="suffix">
                <svg-icon class="finger" name="check-circle" @click="handleAdd"></svg-icon>
                <svg-icon class="finger" name="x-circle" @click="handleClear"></svg-icon>
            </slot>
        </div>
    </div>
</template>
<script setup>
let props = defineProps({
    parentI18M: String,
    modelValue: {
        type: Object,
        default: () => {
            return {
                editing: false,
                fieldValue: '',
                fieldLabel: '',
                value: '',
                valueLabel: '',
                valueOptions: [],
                valueType: 'input',
                optionsLabel: 'label',
                optionsValue: 'value'
            }
        }
    },
    size: {
        type: String,
        default: 'default'
    },
    fields: {
        type: Array,
        default: () => []
    },
    border: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['completed'])

let fieldOrValue = reactive({
    editing: false,
    fieldValue: '',
    fieldLabel: '',
    value: '',
    valueLabel: '',
    valueOptions: [],
    valueType: 'input',
    optionsLabel: 'label',
    optionsValue: 'value'
})

const defaultFieldOption = reactive({
    value: '',
    label: '',
    options: [],
    type: 'input',
    optionsLabel: 'label',
    optionsValue: 'value'
})

let fieldsOptions = ref([])

const handleFieldChange = (value) => {
    if (value) {
        let field = fieldsOptions.value.find(v => v.value === value)
        fieldOrValue.fieldLabel = field ? field.label : ''
        fieldOrValue.value = ''
        fieldOrValue.valueLabel = ''
        fieldOrValue.valueOptions = field ? field.options : []
        fieldOrValue.valueType = field ? field.type : 'input'
        fieldOrValue.optionsLabel = field ? field.optionsLabel : 'label'
        fieldOrValue.optionsValue = field ? field.optionsValue : 'value'
    } else {
        fieldOrValue.value = ''
        fieldOrValue.valueLabel = ''
        fieldOrValue.valueOptions = []
        fieldOrValue.valueType = 'input'
        fieldOrValue.optionsLabel = 'label'
        fieldOrValue.optionsValue = 'value'
    }
    
}
const handleValueChange = (value) => {
    if (value) {
        if (fieldOrValue.valueType === 'select') {
            let option = fieldOrValue.valueOptions.find(v => v[fieldOrValue.optionsValue] === value)
            fieldOrValue.valueLabel = option ? option[fieldOrValue.optionsLabel] : ''
        } else {
            fieldOrValue.valueLabel = value
        }
    } else {
        fieldOrValue.valueLabel = ''
    }
    // emit('completed', fieldOrValue)
}

const handleAdd = () => {
    emits('completed', fieldOrValue)
}

const handleClear = () => {
    fieldOrValue.fieldValue = ''
    fieldOrValue.fieldLabel = ''
    fieldOrValue.value = ''
    fieldOrValue.valueLabel = ''
    fieldOrValue.valueOptions = []
    fieldOrValue.valueType = 'input'
    emits('completed', fieldOrValue)
}
const initFieldsOptions = () => {
    fieldsOptions.value = []
    let option = {}
    if (Array.isArray(props.fields)) {
        props.fields.forEach(field => {
            if (typeof field === 'string') {
                option = {
                    value: field,
                    label: field,
                    options: [],
                    type: 'input'
                }
            } else if (typeof field === 'object') {
                option = Object.assign({}, defaultFieldOption, field)
            }
            fieldsOptions.value.push(option)
        })
    }
    if (props.modelValue.fieldValue) {
        for (let key of Object.keys(fieldOrValue)) {
            fieldOrValue[key] = props.modelValue[key]
        }
    }
}

watch(
    () => props.fields,
    (newVal) => {
        initFieldsOptions()
    },
    {
        immediate: true
    }
)
</script>
<style lang="scss" scoped>
.advanced-query {
    height: 32px;
    display: flex;
    align-items: center;

    .field{
        width: 110px;
        padding-right: 4px;;
    }
    .field-label{
        font-size: 14px;
        padding: 1px 11px;
    }

    .value{
        width: 160px;
        padding-right: 4px;
    }
    .operator{
        height: 100%;
        display: flex;
        align-items: center;
        .finger{
            cursor: pointer;
            font-size: 24px;
        }
    }
}
.advanced-query-border{
    padding: 0 15px;
    border-radius: 20px;
    border: 1px solid #e9e9eb;
    background-color: #f4f4f5;
}
</style>