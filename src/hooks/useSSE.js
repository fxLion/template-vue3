
import { i18n } from '@/i18n'
import { languageString } from '@/utils'
const { t: $t } = i18n.global

const errorStatusMessage = errMsg => {
    ElMessage.error({
      message: errMsg,
      duration: 4000
    })
  }

export function useSSE(url, options, events = {}) {

    let evnetSource = ref(null)

    const createSSE = () => {
        const defaultOptions = {
            withCredentials: false
            // headers: {
            //     lang: languageString(i18n.global.locale.value)
            // },
            // params: params
        }

        evnetSource.value = new EventSource(url)

        evnetSource.value.onopen = () => {
            if (events.sseOpen) {
                events.sseOpen()
            }
            console.log('sse connect success')
        }

        evnetSource.value.onmessage = (event) => {
            const data = event.data
            if (data.type === 'error') {
                errorStatusMessage(data.message)
                console.log(data.message)
            } else {
                if (events.sseMessage) {
                    events.sseMessage(data)
                } else {
                    console.log(data)
                }
            }
        }

        evnetSource.value.onerror = (event) => {
            console.error('sse connect error', event)
            if (events.sseError) {
                events.sseError(event)
            }
            errorStatusMessage(event)
        }
    }
    
    const closeSSE = () => {
        if (evnetSource.value) {
            console.log('sse connect close')
            evnetSource.value.close()
            evnetSource.value = null
        }
    }

    // const sendSSE = (data) => {
    //     if (evnetSource.value) {
    //         evnetSource.value.send(JSON.stringify(data))
    //     }
    // }

    // onMounted(() => {
    //     createSSE()
    // })

    // onUnmounted(() => {
    //     closeSSE()
    // })

    return {
        evnetSource,
        createSSE,
        closeSSE
    }
}