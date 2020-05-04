class Observer {
  constructor (data) {
    this.observe(data)
  }

  observe (data) { // 对 data 数据原有属性改为 set 和 get 形式
    // 如果 data 数据不存在或者不是对象，不进行劫持
    if (!data || typeof data !== 'object') return
    // 对数据一一劫持，现获取到 data 的 key 和 value
    Object.keys(data).forEach(key => {
      // 劫持
      this.defineReactive(data, key, data[key])
      this.observe(data[key]) // 深度递归劫持，因为对象的值还有可能是对象，都要赋予 get 与 set
    })
  }

  /**
   * 定义响应式（数据劫持）
   */
  defineReactive(obj, key, value) {
    let dep = new Dep() // 每个变化的数据都会对应一个存放所有更新的数组
    // 以前我们采用的是 obj.key 取值， obj.key = value 赋值的形式，但是如果我们想在取值或赋值的时候进行其他操作，如弹窗，这种取值赋值方法是无法做到的。此时可采用 Object.defineProperty()
    Object.defineProperty(obj, key, { // 通过 object.defineProperty 的方式定义 data 属性
      enumerable: true,
      configurable: true,
      get: () => { // 取值操作，代替 obj.key
        Dep.target && dep.addSub(Dep.target) // 获取订阅者
        return value
      },
      set: (newValue) => { // 赋值操作，代替 obj.key = value // 注意此处使用箭头函数，以将 this 指向 Observer，取到其 observer 方法。否则 this 是 obj
        if (newValue !== value) { // 只有新值与老值不同才更新
          this.observe(newValue) // 新值劫持（如果是对象，继续劫持）
          value = newValue
          dep.notify() // 通知数据更新
        }
      }
    })
  }
}