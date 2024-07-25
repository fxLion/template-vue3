<template>
  <div class="btn-group">
    <el-button
      :key="index"
      v-for="(item, index) in filterBtns"
      :icon="item.icon"
      :type="item.type
        ? item.type
        : item.key == 'save' || item.key == 'submit' || item.key == 'send' || item.key == 'add' ? 'primary' : ''"
      :disabled="item.disabled"
      @click="onClick(item)"
    >
      {{ $t(item.label) }}
    </el-button>
  </div>
</template>

<script>
import { btnArray } from '@/assets/js/btnArray'

export default {
  props: {
    refParent: Object, // 读取指定级别vue组件实例
    btnSetting: { type: Array, default: () => [] }
  },
  data() {
    return {
      moduleKey: this.$route.meta.actionKey + '_',
      btns: this.filterBtnData(),
      btnStruct: JSON.parse(JSON.stringify(btnArray))
    }
  },
  computed: {
    filterBtns() {
      let _btns = []
      let btnStruct = this.btnStruct

      this.btns.forEach(el => {
        if (/(cancel)$/i.test(el.key)) {
          let btn = btnStruct.find(item => item.key === el.key)
          btn.label = 'button.' + btn.key
          if (btn) _btns.push(btn)
          return
        }
        let key = this.$store.getters.getUserAction.find(
          item => item.toLowerCase() == (this.moduleKey + this.filterAction(el.key)).toLowerCase()
        )
        if (key || this.moduleKey.indexOf('distribution') > -1) {
          let btn = btnStruct.find(item => item.key === el.key)
          if (btn) {
            btn.label = 'button.' + btn.key
          }
          _btns.push(Object.assign({}, btn, el))
        }
      })
      return _btns
    }
  },
  wathch: {
    btnSetting(val) {
      this.btn = this.filterBtnData()
    }
  },
  methods: {
    onClick(item) {
      let event = `${item.event}(${JSON.stringify(this.$attrs)})`
      if (this.refParent) {
        eval('this.refParent.' + event)
      } else {
        eval('this.$parent.' + event)
      }
    },
    filterBtnData() {
      let btnSetting = JSON.parse(JSON.stringify(this.btnSetting))
      return btnSetting.map(el => {
        if (typeof el == 'string') {
          el = { key: el }
        }

        if (typeof el.disabled == 'undefined') {
          if (/(add|cancel|save|submit|send)$/i.test(el.key)) el.disabled = false
          else el.disabled = true
        }
        return el
      })
    },
    filterAction(key) {
      if (key == 'save' || key == 'submit' || key == 'send') {
        if (this.refParent) {
          return this.refParent.flag == 'add' ? 'add' : 'edit'
        } else {
          return this.$parent.flag == 'add' ? 'add' : 'edit'
        }
      } else {
        return key
      }
    },
    btnDisabled(btnKey, disabled) {
      this.btns.forEach(item => {
        if (item.key == btnKey) item.disabled = disabled
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-group {
  display: inline;
}
</style>
