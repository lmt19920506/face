/**
 * 1.很多请求要一起做
 * 2.限制并发数，可配置
 */

/**
 * 异步和多线程
 *
 * 两个任务 -> 跑在两个线程
 */

import ConcurrencyRequest from "./ConcurrencyRequest.js";

const BASE_URL = "http://localhost:8000/";

function getTest1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios(BASE_URL + "test1")
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    }, 2000);
  });
}

function getTest2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios(BASE_URL + "test2")
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    }, 2000);
  });
}
function getTest3() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios(BASE_URL + "test3")
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    }, 2000);
  });
}
function getTest4() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios(BASE_URL + "test4")
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    }, 2000);
  });
}
function getTest5() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios(BASE_URL + "test5")
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    }, 2000);
  });
}
function getTest6() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios(BASE_URL + "test6")
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    }, 2000);
  });
}
function getTest7() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios(BASE_URL + "test7")
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    }, 2000);
  });
}
function getTest8() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios(BASE_URL + "test8")
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    }, 2000);
  });
}
function getTest9() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios(BASE_URL + "test9")
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    }, 2000);
  });
}

const taskQueue = [
    getTest1,
    getTest2,
    getTest3,
    getTest4,
    getTest5,
    getTest6,
    getTest7,
    getTest8,
    getTest9,
]

const concurrencyRequest = new ConcurrencyRequest({
    maxConcurrencyCount: 2
})

for(let task of taskQueue) {
    concurrencyRequest.push(task)
}

console.log(concurrencyRequest.responses)

/**
 * {
 *  test1: {
 *      result: ...
 *      error: ...
 *  }
 * }
 */
