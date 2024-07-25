<template>
  <div class="container">
    <!-- 表格按钮 -->
    <div class="search-box" v-if="leftSpan !== 0 && rightSpan !== 0">
      <el-row>
        <!-- 通用按钮 -->
        <el-col class="left" :span="leftSpan">
          <slot name="left"></slot>
        </el-col>
        <!-- 需要 checkbox 的按钮 -->
        <el-col class="right" :span="rightSpan">
          <slot name="right"></slot>

          <el-button v-if="isMore" class="search-btn more-btn m-l-10" @click="isMoreVisible = !isMoreVisible">
            <el-icon><Filter /></el-icon>{{ $t('common.moreConditions') }}
          </el-button>

          <el-button v-if="isSearch" class="search-btn m-l-10" @click="refresh">
            <el-icon><Search /></el-icon>
          </el-button>
        </el-col>
      </el-row>
    </div>

    <transition name="toggle">
      <div class="more-box" v-if="isMoreVisible">
        <div class="more">
          <slot name="more"></slot>
        </div>
      </div>
    </transition>
    <!-- 表格内容 -->
    <div class="base-table">
      <!-- 表格数据 -->
      <el-table
        ref="baseTableRef"
        v-loading="loading"
        :data="unref(filterData)"
        :row-key="getRowKeys"
        :resizable="true"
        highlight-current-row
        :lazy="lazy"
        :load="load"
        :tree-props="treeProps"
      >
        <!-- 多选 -->
        <el-table-column v-if="isCheckbox" type="selection" :reserve-selection="false" width="55" />
        <!-- 数据列 -->
        <base-table-column
          v-for="(col, index) in unref(filterColumns)"
          v-bind="getCol(col, index)"
          :ref="el => setColRef(el, col.dataField)"
          :key="col.dataField"
          :filterData="filterData"
          :calColumnWidth="calColumnWidth"
        >
          <template v-slot="scope">
            <slot
              :name="'col_' + col.dataField"
              :row="scope.row"
              :rowIndex="scope.$index"
              :rows="filterData"
              :col="col"
              :cols="filterColumns"
            >
              <span>{{ filterValue(scope.row[col.dataField]) }}</span>
            </slot>
          </template>
        </base-table-column>

        <!-- 操作列 -->
        <base-table-column
          v-if="isOpsColumns && filterData.length > 0"
          :label="$t('common.operationCol')"
          :ref="el => setColRef(el, 'ops_col')"
          :filterData="filterData"
          :calColumnWidth="calColumnWidth"
          fixed="right"
          align="center"
          class-name="yyyyyyyyyy"
        >
          <template v-slot="scope">
            <slot name="edit" :row="scope.row" :col="scope.column" :index="scope.$index"></slot>
          </template>
        </base-table-column>
      </el-table>

      <!-- 表格页码 -->
      <component
        v-if="isPagination"
        :is="paginationType"
        :page-total="pageTotal"
        :page-data="pageData"
        @index-change="pageIndexChange"
        @size-change="pageSizeChange"
      >
      </component>
    </div>
  </div>
</template>

<script setup>
  import useI18nModule from '@/hook/useI18nModule'
  import BaseTableColumn from './L7BaseTableColumn'
  import axios from '@/api/axios'
  import { computed, nextTick, onMounted, reactive, ref, shallowRef, toRefs, unref, watch } from 'vue'
  const { i18nModule: i18nM } = useI18nModule()
  const i18n = useI18n()

  const emit = defineEmits(['set-data'])
  const props = defineProps({
    /* 操作按钮 */
    btnSetting: { type: Array, default: () => [] },
    leftSpan: { type: Number, default: 11 },
    rightSpan: { type: Number, default: 13 },

    /* 表格内容 */
    autoload: { type: Boolean, default: true }, //是否在调用控件时进行第一次自动加载
    reqUrl: String,
    params: {
      type: Object,
      default() {
        return {}
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    lazy: { 
      type: Boolean, 
      default: false 
    },
    load: {
      type: [Function, null],
      default: null
    },
    treeProps: {
      type: Object,
      default: () => {
        return {}
      }
    },
    typeColumns: Array,
    rowKey: { type: String },
    isCheckbox: { type: Boolean, default: false },
    isOpsColumns: { type: Boolean, default: false },
    isSearch: { type: Boolean, default: false },
    isMore: { type: Boolean, default: false },
    validate: {
      type: Function,
      default: () => {
        return true
      }
    },

    /* 表格页码 */
    isPagination: { type: Boolean, default: true },
    paginationType: { type: String, default: 'L7BasePagination' }, // BasePagination、BaseNextPagination
    pageSize: { type: Number, default: 10 },

    /* i18n 翻译 */
    loadi18Module: { type: Boolean, default: true },
    langRootKey: { type: String, default: '' },

    /* 表格轮询 */
    queryRep: { type: Boolean, default: false },
    queryRepKey: {
      type: Object,
      default: () => ({ key: 'deployStatus', val: 1, time: 20 })
    }
  })

  const baseTableRef = ref(null)
  const isMoreVisible = ref(false)
  const loading = ref(false)
  const tableData = shallowRef([]) // 改为shallowRef， 只有通过调用tabeData.value重新设置数据才会触发重新计算列宽
  const tableCols = ref(props.columns)
  const pageTotal = ref(10)
  const pageData = reactive({ pageNum: 1, pageSize: props.pageSize })
  const loadMap = new Map()

  const filterData = computed(() => {
    let data = props.data.length ? props.data : unref(tableData)
    return data
  })
  const filterColumns = computed(() => {
    if (!props.typeColumns) return unref(tableCols)

    let typeColumns = props.typeColumns ? props.typeColumns : []
    let keyToColumn = {}
    typeColumns.forEach(col => col.dataField && (keyToColumn[col.dataField] = col))

    let newTypeColumns = []
    for (let col of unref(tableCols)) {
      let typeCol = col.dataField && col.dataField in keyToColumn ? keyToColumn[col.dataField] : []
      newTypeColumns.push({ ...col, ...typeCol })
    }
    return newTypeColumns
  })
  const colsRefs = shallowRef({})

  const getRowKeys = row => (props.rowKey && row[props.rowKey] ? row[props.rowKey] : row.id)
  const getCol = (col, index) => {
    let newCol = {}
    let attributeMap = {
      dataField: col => {
        newCol['prop'] = col.dataField
      },
      fixed: (col, index) => {
        newCol['fixed'] = col.fixed || (filterColumns.length > 1 && index == 0 && typeof col.fixed === 'undefined')
      },
      label: col => {
        let { loadi18Module, langRootKey } = props
        let labelKey =
          (loadi18Module ? unref(i18nM) : '') +
          (langRootKey ? langRootKey + (langRootKey.endsWith('.') ? '' : '.') : '') +
          col.dataField
        newCol['label'] = i18n.t(labelKey)
      },
      className: col => {
        newCol['class-name'] = col.showOverflowTip
          ? `${col.className ? col.className : ''} yyyyyyyyyy`
          : `${col.className ? col.className : ''} ${col.width ? 'yyyyyyyyyy' : 'xxxxxxxxxx'}`
      }
    }
    // 用户不传，但也必须通过 attributeMap 处理得到对应的默认值
    let specialCol = ['label', 'className']

    for (let key of Object.keys(col).concat(specialCol)) {
      attributeMap.hasOwnProperty(key) ? attributeMap[key](col, index) : (newCol[key] = col[key]) // 特殊处理 or 直接传值
    }
    return newCol
  }

  const getData = (fromPage, isLoading = true) => {
    loading.value = isLoading

    let reqData = props.isPagination ? Object.assign({}, props.params, pageData) : props.params
    return new Promise((resolve, reject) => {
      if (props.validate()) {
        axios
          .get(props.reqUrl, reqData, {}, false)
          .then(res => {
            if (res.data.cols) tableCols.value = res.data.cols
            tableData.value = res.data.content
            pageTotal.value = res.data.totalSize
            emit('set-data', res.data)
          })
          .finally(() => {
            loading.value = false
          })
      }
    })
  }
  if (props.reqUrl && props.autoload) {
    getData()
  } else {
    // 如果没有 reqUrl且已有传入数据时，需要手动设置 tableData.value从而达到初始渲染效果
    if(props.data.length) {
      tableData.value = props.data
      pageTotal.value = props.data.length
    }
  }

  const refresh = () => {
    pageData.pageNum = 1
    getData(true)
  }
  const pageIndexChange = index => {
    pageData.pageNum = index
    getData(true)
  }
  const pageSizeChange = size => {
    pageData.pageSize = size
    pageData.pageNum = 1
    getData(true)
  }

  const filterValue = val => {
    if (val === '' || val === undefined || val === null) {
      return '-'
    }
    return val
  }

  const reloadChildData = (parentId) => {
    if (!props.lazy) return
    console.log('reloadChildData', parentId)
    if (loadMap.has(parentId)) {
      let { row, treeNode, resolve } = loadMap.get(parentId)
      let childrenNodeLength = unref(baseTableRef).store.states.lazyTreeNodeMap.value[parentId].length || 0
      if (childrenNodeLength > 1) {
        unref(baseTableRef).store.states.lazyTreeNodeMap[parentId] = []
      } else {
        unref(baseTableRef).store.states.lazyTreeNodeMap.value[parentId] = []
      }
      // loading.value = true
      props.load && props.load(row, treeNode, resolve)
    }
  }

  const setLoadMap = (row, treeNode, resolve) => {
    if (!row) return
    if (loadMap.has(row.id)) {
      loadMap.delete(row.id)
    }
    console.log('setLoadMap', row.id)
    loadMap.set(row.id, {row, treeNode, resolve})
  }

  const resetLoadMap = () => {
    props.lazy && loadMap.clear()
  }

  defineExpose({ getData, refresh, tableData, reloadChildData, setLoadMap })

  /* Table 自适应计算 */
  const calColumnWidth = () => {
    const colgroup = unref(baseTableRef).$el.querySelector('colgroup')
    const columnIds = Array.from(colgroup.childNodes).map(col => col.getAttribute('name'))

    let colToMaxWidth = {}
    columnIds.forEach((columnId, index) => {
      let curColumn = unref(filterColumns)[index]
      let { val: width, isValid: isWidth } = parseWidth(curColumn?.width)
      let { val: minWidth, isValid: isMinWidth } = parseWidth(curColumn?.minWidth)

      if (isWidth) {
        let columnWidth = Math.floor(isMinWidth && minWidth > width ? minWidth : width)
        colToMaxWidth[columnId] = { width: columnWidth, isCustom: !(isMinWidth && minWidth > width) }
      } else {
        // 未设置宽度，则根据单元格内容自适应
        let cells = unref(baseTableRef).$el.querySelectorAll(`.${columnId} .cell`)
        let maxWidth = Math.max.call(Math, ...Array.from(cells).map(cell => cell.getBoundingClientRect().width))
        // 修复
        // const headerColClass = `.el-table__header-wrapper>table>thead>tr>th.${columnId}`
        // const firstRowColClass = `.el-table__body>table>tbody>tr:nth-child(1)>td.${columnId}`
        // const firstRowColClass = `.el-table__body>tbody>tr:nth-child(1)>td.${columnId}${curColumn ? '' : '>.cell'}`
        // let headerCol = window.document.querySelectorAll(headerColClass)[0]
        // let firstRowCol = window.document.querySelectorAll(firstRowColClass)[0]
        // let headerColWidth = parseInt(headerCol.getBoundingClientRect().width)
        // let firstRowColWidth = parseInt(firstRowCol.getBoundingClientRect().width)
        // let maxWidth = Math.max(headerColWidth, firstRowColWidth)
        let columnWidth = Math.floor(isMinWidth && minWidth > maxWidth ? minWidth : maxWidth)
        colToMaxWidth[columnId] = { width: columnWidth, isCustom: false }
      }
    })
    return colToMaxWidth
  }
  const parseWidth = num => {
    let val = Number.parseInt(num)
    return { val, isValid: !isNaN(val) }
  }

  const setColRef = (el, dataField) => {
    if (el) {
      colsRefs.value[dataField] = el
    }
  }

  const reLayoutColumns = () => {
    for (let key in colsRefs.value) {
      colsRefs.value[key] && colsRefs.value[key].updateAutoWidth()
    }
  }

  // 监听 tableData 变化, 重新计算列宽
  watch(tableData, () => {
    nextTick(() => {
      setTimeout(() => {
        resetLoadMap()
        reLayoutColumns()
      }, 0)
    })
  }, {
    immediate: true
  })
</script>

<style lang="scss" scoped>
  .container {
    background-color: #ffffff;
    border-radius: 4px;
    padding: 20px 0;
    .search-box {
      padding: 0 20px 30px;
      .left {
        text-align: left;
      }
      .right {
        text-align: right;
        float: right;
      }
      .more-btn {
        font-size: 12px;
        color: #303133;
        i {
          margin-right: 10px;
        }
      }
      .search-btn {
        --el-button-hover-border-color: #8394ed;
        --el-button-hover-bg-color: #f7f8ff;
      }
      .search:hover {
        svg {
          color: #556bda;
        }
      }
    }

    .more {
      background-color: #f7f8ff;
      border-top: 1px solid #dcdfe6;
      padding: 20px;
      margin-bottom: 20px;
    }
    .base-table {
      padding: 0 20px;
      margin-bottom: 10px;
    }
    &.inline-table {
      padding: unset;
      .search-box {
        padding: unset;
      }
    }
  }

  .more-box {
    overflow: hidden;
    max-height: 150px;
  }

  .toggle-enter-from,
  .toggle-leave-to {
    opacity: 0;
    max-height: 0px;
  }
  .toggle-enter-active,
  .toggle-leave-active {
    transition: all 0.4s ease-in-out;
  }
</style>
