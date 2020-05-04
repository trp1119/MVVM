// 发布者

class Dep {
  constructor () {
    this.subs = [] // 订阅的数组
  }
  /**
   * 添加订阅
   */
  addSub (watcher) {
    this.subs.push(watcher)
  }
  /**
   * 发布
   */
  notify () {
    this.subs.forEach(watcher => watcher.update())
  }
}