<template>
  <div ref="chartRef" style="width: 100%"></div>
</template>

<script setup>
  import { onMounted, onUnmounted, watch } from 'vue'
  import echarts from './echarts'

  const props = defineProps({
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
        type: 'value',
      },
      yAxis: {
        type: 'category',
      },
      legend: {},
      grid: {
        top: '40', // 默认 60
        bottom: '20', // 默认 60
        right: '10', // 默认 10%
        left: '10%' // 默认 10%
      }
    }
    return Object.assign(options, props.options)
  })
  let myChart = {}
  const resize = () => myChart.resize()
  const updateChart = () => {
    myChart.setOption(unref(mergeOptions))
  }

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
