export default class ConcurrencyRequest {
  constructor({ maxConcurrencyCount }) {
    this.maxConcurrencyCount = maxConcurrencyCount;
    this.taskQueue = [];
    this.responses = {};

    setTimeout(() => {
        console.log(this.taskQueue)
        this._doRequest()
    })
  }

  push(task) {
    this.taskQueue.push(task);
  }

  _doRequest() {
    if (!this.taskQueue.length) return
    const minConcurrencyCount = _getMinCount(this.maxConcurrencyCount, this.taskQueue.length)

    for(let i =0; i < minConcurrencyCount; i++) {
        const task = this.taskQueue.shift();  // 从头拿一个出来
        this.maxConcurrencyCount--  // 拿一个出来后，就要减一个
        this._runTask(task)
    }
  }

  _runTask(task) {
    task().then(res => {
        // console.log(res)
        this.responses[task.name] = {
            result: res,
            error: null
        }
    }).catch(err => {
        // console.log('err---', err)
        this.responses[task.name] = {
            result: null,
            error: err

        }
    }).finally(() => {
        this.maxConcurrencyCount++
        this._doRequest()
    })
  }
}

function _getMinCount(count1, count2) {
    return Math.min(count1, count2)
}