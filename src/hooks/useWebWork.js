import { ref, unref } from "vue"
import Worker from '@public/worker.js?worker'

export default function useWebWork(message) {
    let work = ref(null)

    let createWorker = () => {
        if (work.value) {
            closeWorker()
            createWorker()
        } else {
            work.value = new Worker()
            console.log("worker created")
            work.value.onmessage = message
            work.value.onerror = (error) => {
                console.log("worker error", error)
                closeWorker()
            }
        }
    }

    let postMessage = (data) => {
        unref(work).postMessage(data)
        console.log("post message to worker", data)
    }

    // let onMessage = (event) => {
    //     unref(work).onmessage = message(event)
    //     console.log("on message from worker", event.data)
    // }

    let closeWorker = () => {
        unref(work) && unref(work).terminate()
        work.value.onmessage = null
        work.value = null
        console.log("worker closed")
    }

    return {
        work,
        createWorker,
        postMessage,
        closeWorker
    }
}
