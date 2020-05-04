// 订阅者（观察者）：给需要变化的元素添加观察者，将新值与老值进行比对，当数据变化时，执行对应的更新方法。
// 例如，为 <input type="text" v-nodel="name" /> 元素添加观察者，当 data 中 { name：'zhangsan' } 变化时，执行更新方法。
class Watcher {
  constructor (vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb
    // 由于要对比新值与老值，所以 new Watcher() 时即先获取到老值
    this.oldVal = this.get()
  }

  /**
   * 根据表达式获取实例上对应的数据
   * @param {*} vm 
   * @param {*} expr 
   */
  getVal (vm, expr) {
    return expr.split('.').reduce((prev, next) => {
      return prev[next]
    }, vm.$data)
  }

  get () {
    Dep.target = this // this 指 new 的 watcher 实例
    let value = this.getVal(this.vm, this.expr)
    Dep.target = null
    return value
  }

  /**
   * 对外暴露的更新方法
   */
  update () {
    let newVal = this.getVal(this.vm, this.expr) // 获取新值
    if (newVal !== this.oldVal) { // 比较老值与新值
      this.cb() // 调用 Watcher 的 callback
    }
  }
}