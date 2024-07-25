import { ElTableColumn } from 'element-plus'

export default {
  name: 'BaseTableColumn',
  extends: ElTableColumn, // 指定继承组件
  setup(props, ctx) {
    return {
      ...ElTableColumn.setup(props, ctx),
      filterData: props.filterData
    }
  },
  props: {
    autoFit: {
      type: Boolean,
      default: true
    },
    fitGap: {
      type: Number,
      default: 0
    },
    calColumnWidth: {
      type: Function
    }
  },
  data() {
    return {
      instance: {},
      baseTableWidth: 0
    }
  },
  methods: {
    updateAutoWidth() {
      if (!this.autoFit) return

      const { columnId, columnConfig } = this.instance
      const colToMaxWidth = this.calColumnWidth()

      if (columnId in colToMaxWidth) {
        const sum = Object.values(colToMaxWidth)
          .map(item => item.width)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        const columnWidth = colToMaxWidth[columnId].width
        const isCustom = colToMaxWidth[columnId].isCustom

        if (isCustom) {
          const colClass = `.el-table__body-wrapper table>tbody>tr>td.${columnId}>.cell`
          let headerCol = window.document.querySelectorAll(colClass)
          for (let col of headerCol) {
            col.style.width = columnWidth + 'px'
          }
          // columnConfig.width = columnWidth
          return
        }

        if (this.baseTableWidth > sum) {
          let padding = (this.baseTableWidth - sum) / Object.values(colToMaxWidth).filter(item => !item.isCustom).length
          columnConfig.minWidth = columnWidth + padding
        } else {
          columnConfig.minWidth = columnWidth + 10
        }
      }
    }
  },
  updated() {
  },
  mounted() {
    this.instance = getCurrentInstance()
    this.$nextTick(() => {
      this.baseTableWidth = this.$parent.$el.offsetWidth
      // this.updateAutoWidth()
    })
  }
}
