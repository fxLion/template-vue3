<template>
    <div ref="chartRef"></div>
</template>
  
<script setup>
import { onBeforeMount, onMounted, onUnmounted, unref } from 'vue'
import echarts from './echarts'
import "echarts/lib/chart/map";
import worldJson from '@public/world.json'
import 'echarts/extension/bmap/bmap';

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

const loadMapJSON = () => {
    return import ('@public/world.json').then((module) => {
        return module.default
    }).catch(error => {
        console.error("Failed to load JSON part: ", error);
    })
}

let chartRef = ref(null)
let mergeOptions = computed(() => {
    let options = {
        backgroundColor: "#fff",
        tooltip: {
            show: false,
            trigger: "item",
        },
        geo: {
            map: "world",
            zoom: 1,
            left: '10%',
            right: '10%',
            roam: true, //是否允许缩放
            layoutCenter: ["50%", "50%"], //地图位置
            // layoutSize: "100%",
            itemStyle: {
              regions: {
                color: function (params) {
                  return params.color
                }
              },
              normal: {
                  color: "#DAE0FD", //地图背景色
                  borderColor: 'rgba(131, 148, 237, 0.8)', //省市边界线00fcff 516a89 #9FA1A6
                  // borderWidth: 1
              }
            },
            emphasis: {
                label: {
                    show: false
                },
                itemStyle: {
                    color: '#DAE0FD', //悬浮背景 rgba(131, 148, 237, 0.5)
                    // borderColor: 'rgba(131, 148, 237, 0.8)'
                }
            }
        },
        series: [],
    };
    return Object.assign(options, props.options)
})
let myChart = null
const resize = () => myChart && myChart.resize()
const updateChart = () => myChart && myChart.setOption(unref(mergeOptions))

watch(() => props.options, () => {
  updateChart()
})

onMounted(() => {
    // loadMapJSON().then((worldJson) => {
        echarts.registerMap('world', worldJson);
        myChart = echarts.init(unref(chartRef))
        updateChart()
        if (props.other.isAutoResize) {
            window.addEventListener('resize', resize)
        }
    // })
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
    if (myChart) {
        myChart.dispose()
        myChart = null  
    }
})

defineExpose({ updateChart, resize })
</script>
  
<style lang="scss" scoped></style>
  