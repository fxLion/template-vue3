// import Worker from '@public/worker.js?worker'
/**
 * Represents a pool of web workers.
 * 表示一个 Web Worker 池。
 */
// import Worker from '@/assets/worker/worker.js?worker'

export class WebWorkerPool {
    /**
     * Creates a new WebWorkerPool instance.
     * 创建一个新的 WebWorkerPool 实例。
     * @param {number} poolSize - The maximum number of workers in the pool. Default is 4.
     *                            池中的最大工作线程数。默认为 4。
     * @param {Array} list - The initial list of tasks to be executed by the workers.
     *                       工作线程要执行的初始任务列表。
     */
    constructor(poolSize = 4, list = []) {
        this.poolSize = poolSize;
        this.waitQueue = list;
        // this.workerJS = {}
        this.runningQueue = [];
        this.workers = [];
        this.init()
    }

    init() {
        while (this.runningQueue.length < this.poolSize && this.waitQueue.length > 0) {
            this.initWorker();
        }
    }

    /**
     * Initializes a worker and assigns a task to it.
     * 初始化一个工作线程并分配任务给它。
     * @private
     */
    async initWorker() {
        let workerInfo = this.waitQueue.shift();
        const worker = new Worker(workerInfo.data.workerPath);
        worker.onmessage = e => this.onWorkerDone(e, workerInfo.callback);
         // 处理工作线程错误
        worker.onerror = e => {
            console.error(`Worker error: ${e.message}`, e);
            // 从运行队列中移除出错的工作线程
            const index = this.runningQueue.findIndex(task => task.worker === worker);
            if (index !== -1) {
                this.runningQueue.splice(index, 1);
                workerInfo.callback && workerInfo.callback({ error: e.message })
            }

            // 如果有等待的任务，启动一个新的工作线程
            if (this.waitQueue.length > 0) {
                this.initWorker();
            }
        }
        worker.postMessage(workerInfo.data);
        this.runningQueue.push({ id: workerInfo.id, worker });
        this.workers.push(worker);
    }

    /**
     * Handles the completion of a worker task.
     * 处理工作线程任务的完成。
     * @param {Object} e - The message event received from the worker.
     *                     从工作线程接收到的消息事件。
     * @param {Function} cb - The callback function to be called with the worker's result.
     *                        用于处理工作线程结果的回调函数。
     * @private
     */
    onWorkerDone(e, cb = null) {
        const { id, info } = e.data;
        const index = this.runningQueue.findIndex(task => task.id === id);
        if (index !== -1) {
            let worker = this.runningQueue[index].worker
            worker.terminate()
            this.runningQueue.splice(index, 1);
            if (cb) {
                cb(info);
            }
        }
        if (this.runningQueue < this.poolSize && this.waitQueue.length > 0) {
            this.initWorker();
        }
    }

    /**
     * Adds a new task to the pool.
     * 向池中添加一个新任务。
     * @param {any} data - The data to be processed by the worker.
     *                    工作线程要处理的数据。
     */
    addTask(data = null) {
        if (!data) return
        this.waitQueue.push(data);
        if (this.runningQueue.length < this.poolSize) {
            this.initWorker();
        }
    }

    /**
     * Terminates all running workers and clears the task queues.
     */
    destroy() {
        this.runningQueue.forEach(item => item.worker.terminate());
        this.waitQueue = [];
        this.workers = [];
        console.log('destroy')
        // this.workerJS = {}
    }
}
