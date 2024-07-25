<template>
  <div ref="chartRef"></div>
</template>

<script setup>
  import { onMounted, onUnmounted, watch } from 'vue'
  import echarts from './echarts'

  const props = defineProps({
    data: {
      type: Array
    },
    xAxis: {
      type: Array
    },
    other: {
      type: Object,
      default() {
        return {
          isAutoResize: true
        }
      }
    },
    options: {
      type: Object,
      default: function () {
        return {}
      }
    }
  })

  let chartRef = ref(null)
  let mergeOptions = computed(() => {
    let isReplace = props.options.isReplace || false
    let options = {
      xAxis: {
        type: 'category',
        data: props.xAxis
      },
      yAxis: {
        type: 'value'
      },
      grid: {
        top: '40', // 默认 60
        bottom: '20', // 默认 60
        right: '10', // 默认 10%
        left: '10%' // 默认 10%
      },
      series: [{ type: 'bar', data: props.data }]
    }
    return isReplace ? props.options : Object.assign(options, props.options)
  })
  let myChart = {}
  const resize = () => myChart.resize()
  const updateChart = () => myChart.setOption(unref(mergeOptions))

  watch(() => props.options, () => {
    resize()
    updateChart()
  })
  
  onMounted(() => {
    myChart = echarts.init(unref(chartRef))
    updateChart()

    if (props.other.isAutoResize) {
      window.addEventListener('resize', resize)
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
  })

  defineExpose({ updateChart, resize })
</script>

<style lang="scss" scoped></style>
