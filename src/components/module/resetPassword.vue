<template>
  <l7-base-dialog ref="baseDialogRef" :title="$t(i18M + 'title')" @close="resetForm" width="480px">
    <l7-base-form
      ref="baseFormRef"
      :hide-required-asterisk="true"
      :model="baseForm"
      class="form-content label-input-vertical"
    >
      <l7-base-form-items :lang-root-key="i18M" :key-settings="keySettings">
        <!-- 当前密码 -->
        <template #oldPassword>
          <el-input
            type="password"
            show-password
            v-model="baseForm.oldPassword"
            maxlength="30"
            autocomplete="off"
            :placeholder="$t(i18M + 'oldPassword')"
          >
          </el-input>
        </template>
        <!-- 新密码 -->
        <template #newPassword>
          <el-input
            type="password"
            show-password
            v-model="baseForm.newPassword"
            maxlength="30"
            autocomplete="off"
            :placeholder="$t(i18M + 'newPassword')"
          >
          </el-input>
        </template>
        <!-- 新密码确认 -->
        <template #confirmPassword>
          <el-input
            type="password"
            show-password
            v-model="baseForm.confirmPassword"
            autocomplete="new-password"
            maxlength="30"
            :placeholder="$t(i18M + 'confirmPassword')"
          >
          </el-input>
        </template>
      </l7-base-form-items>
    </l7-base-form>

    <template #footer>
      <el-button @click="close">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">{{ $t('button.confirm') }}</el-button>
    </template>
  </l7-base-dialog>
</template>

<script setup>
  import { onBeforeMount, onBeforeUnmount, unref } from 'vue'
  import FormRule from '@/components/l7-base/form/rule.js'
  import { SuccessMessage } from '@/hook/common'
  import axios from '@/api/axios'
  import useI18nModule from '@/hook/useI18nModule'
  const { t } = useI18n()
  const { i18nModule: parentI18M } = useI18nModule()
  const i18M = 'common.components.resetPasswordDialog.'
  const baseFormRef = ref(null)
  const baseDialogRef = ref(null)

  const emit = defineEmits(['success'])
  const baseForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const keySettings = reactive([
    {
      key: 'oldPassword',
      formItemAttrs: {
        required: true
      }
    },
    {
      key: 'newPassword',
      formItemAttrs: {
        required: true,
        rules: [
            {
                validator: FormRule.password,
                trigger: 'blur'
            }
        ]
      }
    },
    {
      key: 'confirmPassword',
      formItemAttrs: {
        required: true,
        rules: [
          {
            validator: FormRule.password,
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (value !== baseForm.newPassword) {
                callback(new Error(t(i18M + 'passwordNotMatch')))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  ])

  let loading = ref(false)

  const handleConfirm = () => {
    unref(baseFormRef).validate(valid => {
      if (!valid) return
        loading.value = true
        let params = {
          newPassword: baseForm.newPassword,
          oldPassword: baseForm.oldPassword
        }
        axios.post('/api/manager/user/changePassword', params).then(res => {
          SuccessMessage(parentI18M, 'changePasswordSucc')
          close()
        }).finally(() => { 
          loading.value = false
        })
    })
  }

  const open = () => unref(baseDialogRef).open()
  const close = () => unref(baseDialogRef).close()
  const resetForm = () => unref(baseFormRef) && unref(baseFormRef).resetFields()

  onBeforeUnmount(() => {
    resetForm()
  })

  defineExpose({ close, open })
</script>
