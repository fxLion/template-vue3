<template>
  <div ref="chartRef" v-resize:300="handleResize"></div>
</template>

<script setup>
  import { onMounted, onUnmounted } from 'vue'
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
      series: [{ type: 'line', smooth: true, data: props.data }]
    }
    return Object.assign(options, props.options)
  })
  let myChart = {}
  const resize = () => myChart.resize()
  const updateChart = () => myChart.setOption(unref(mergeOptions))

  const handleResize = () => {
    if (props.other.isAutoResize) {
      resize()
    }
  }

  onMounted(() => {
    myChart = echarts.init(unref(chartRef))
    updateChart()

  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
  })

  defineExpose({ updateChart })
</script>

<style lang="scss" scoped></style>
