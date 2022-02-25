let uid = 1
let id = null
const queue = []

const scheduling = new MessageChannel()
const tasks = [];

// tasks中的任务会在每次浏览器循环中执行 isForce用来记录某次循环的任务执行之前是否需要先强制刷新
(tasks).isForce = false

let pipeline = false

// 监听浏览器标签页的切换事件
window.document.addEventListener('visibilitychange', () => {
  // 如果标签页被切换后又被切回 那么需要重新校正定时器队列的startTime
  if (document.visibilityState === 'visible') {
    for (let i = 0, l = queue.length; i < l; i++) {
      const callback = queue[i]
      callback.startTime = Date.now()
    }
  }
})

// 循环主体
function loop() {
  for (let i = 0; i < queue.length; i += 1) {
    const time = new Date().getTime()
    const callback = queue[i]
    if (time - callback.startTime >= callback.time) {
      callback.startTime += callback.time
      callback.fn()

      // 如果是setDelay那么在执行之后需要清除
      if (callback.type === 'delay') {
        clear(callback.timerId)
        i -= 1
      }
    }
  }
  if (queue.length) id = requestAnimationFrame(loop)
}

// 添加回调
function add(fn, time, key, args, type) {
  if (typeof fn !== 'function') {
    console.error('定时器第一个参数必须为函数')
    return
  }

  // 将回调添加到队列
  const timerId = uid++
  queue.push({
    key,
    startTime: new Date().getTime(),
    timerId,
    fn: fn.bind(...args),
    time: time || (1000 / 60),
    type,
  })

  // 启动定时器
  if (id === null) {
    loop()
  }

  return timerId
}

// 清除回调
function clear(timerId) {
  queue.forEach((callback, i) => (timerId === callback.timerId && queue.splice(i, 1)))
  if (!queue.length) {
    cancelAnimationFrame(id)
    id = null
  }
}

/**
 * 设置一个下一次event loop执行的任务
 * @param {function} task 回调
 */
function setTask(task, isForce) {
  // 打开管道
  if (!pipeline) {
    pipeline = true
    scheduling.port2.postMessage('open')
  }

  // 添加任务
  if (isForce !== undefined) (tasks).isForce = isForce
  tasks.push(task)
}

// 执行的任务˛
// eslint-disable-next-line no-unused-vars
scheduling.port1.onmessage = function (event) {
  // 关闭管道
  if (pipeline) {
    pipeline = false
  }

  // 复制任务队列
  const ts = tasks.slice(0)

  // 清空主队列
  tasks.length = 0

  // 任务执行之前先看看是否要强制刷新下界面
  if ((tasks).isForce) {
    document.body.getBoundingClientRect()
  }
  (tasks).isForce = false

  // 执行任务
  for (let i = 0; i < ts.length; i += 1) {
    ts[i]()
  }
}

function clearKey(key) {
  queue.forEach((callback, i) => (key === callback.key && queue.splice(i, 1)))
  
  if (!queue.length) {
    cancelAnimationFrame(id)
    id = null
  }
}

export default {
  /**
   * 循环定时 支持传回调参数 和原生定时器唯一不同的是回调参数是从第四个开始
   * 如果是图表组件的轮播动画一定要记得给key（一般是组件实例的uuid）否则在换图后定时器不能及时清除
   * @param {function} fn     回调函数
   * @param {number}   time   间隔时间
   * @param {string}   key    一个key标识 可以通过调用clearKey来清除定时器 但一般不需要这样 一般调clear利用timeID清除即可
   * @param {array}    args   回调函数参数
   */
  setLoop: (fn, time, key, ...args) => add(fn, time, key, args, 'loop'),

  /**
   * 延迟定时 支持传回调参数 和原生定时器唯一不同的是回调参数是从第四个开始
   * @param {function} fn     回调函数
   * @param {number}   time   间隔时间
   * @param {string}   key    一个key标识 可以通过调用clearKey来清除定时器 但一般不需要这样 一般调clear利用timeID清除即可
   * @param {array}    args   回调函数参数
   */
  setDelay: (fn, time, key, ...args) => add(fn, time, key, args, 'delay'),

  // 设置一个下一个event loop执行的任务 相当于 node 的setImmediate()方法和process.nextTick()
  setTask,

  // 清除定时器
  clear,

  // 根据key批量清除数据
  clearKey,
}
