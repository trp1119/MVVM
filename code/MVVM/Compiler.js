class Compiler {
  constructor (el, vm) { // el 为模板，vm 为 this 实例
    // el 的值可能是字符串 '#app'，也有可能是元素 document.getElementById('#app')
    // 判断 el属性 是否是元素，如果不是元素，则获取它
    // 为了扩展时所有类的属性都能在原型上取到，将所有值都绑定到实例上
    this.el = this.isElementNode(el) ? el : document.querySelector(el)
    this.vm = vm

    // 在匹配 data 时，如果每匹配到一个数据就渲染一次，会造成页面不停的回流与重绘，可先将模板放入内存中，在内存中完全替换完毕后，再放回页面，性能比每匹配到一个就替换性能更佳。
    // 把当前节点中的元素获取到，放到内存中
    if (this.el) { // 如果能获取到这个元素，才开始编译
      // 1. 通过文档碎片 fragemnt 先把真实 DOM 移入到内存中，在内存中操作 DOM 比在真实 DOM 中操作快
      let fragement = this.node2fragement(this.el)
      // 2. 提取 fragement 中的元素节点 v-model 和文本节点 {{}} 进行编译，对节点中的内容进行替换
      this.compile(fragement)
      // 3. 把编译好的 fragement 放回页面中
      this.el.appendChild(fragement)
    }
  }

  /**
   * 辅助方法，如判断是否是元素，判断是否是文本，判断指令
   */

  /**
   * 判断是否是元素节点
   * @param {*} node 节点
   */
  isElementNode (node) {
    return node.nodeType === 1
  }
  /**
   * 判断是否是指令（判断属性名是否包含 v-）
   * @param {*} attrName 属性名
   */
  isDirective (attrName) {
    return attrName.startsWith('v-')
  }

  /**
   * 核心方法
   */

  /**
   * 页面 DOM 节点 转 文档碎片 节点
   * @param {*} node 页面 DOM 节点
   */
  node2fragement (node) { // 需要将 node（el）中的内容全部放入到内存中
    let fragement = document.createDocumentFragment() // 创建文档碎片，存放于内存中
    let firstChild
    while (firstChild = node.firstChild) { // firstChild = node.firstChild 这样永远拿到的第第一个子元素，会出现死循环，所以可以拿到一个子元素就将其放入内存中，然后使用 appendChild 将 node 中对应的子节点移除，下次遍历时自动获取到下一个子节点。
      // 页面 DOM 都具有 DOM映射，将页面一个节点移入内存中，则页面节点少一个
      // appendChild 具有移动性，可以对 DOM 节点进行移动
      fragement.appendChild(firstChild)
    }
    return fragement
  }
  /**
   * 核心编译方法：编译所有节点
   * @param {*} fragement 文档碎片（内存中的所有节点）
   */
  compile (fragement) {
    let childNodes = [...fragement.childNodes] // 拿到的是 类数组，需转为数组
    childNodes.forEach(node => {
      if (this.isElementNode(node)) { // 元素节点
        // 编译元素
        this.compileElement(node)
        // 如果是元素节点，还需要递归深入检查子元素节点和文本节点
        this.compile(node) // 注意：此处还是使用 this，因为 forEach 中回调用的箭头函数，现在的 this 还是指向实例
      } else { // 文本节点
        // 编译器文本
        this.compileText(node)
      }
    })
  }
  /**
   * 编译元素
   * @param {*} node 节点
   */
  compileElement (node) {
    let attributes = [...node.attributes]
    attributes.forEach(attr => {
      // 判断是否是指令
      let {name: attrName, value: expr} = attr
      if (this.isDirective(attrName)) {
        // 取到对应的值，放到节点中
        let [, directive] = attrName.split('-')
        let [directiveName, eventName] = directive.split(':')
        CompileUtil[directiveName](node, this.vm, expr, eventName) // 去 this.vm 中 找到 expr 值放入到 node 中
      }
    })
  }
  /**
   * 编译文本
   * @param {*} node 节点
   */
  compileText (node) {
    let expr = node.textContent // 取文本中的内容
    if (/\{\{(.+?)\}\}/.test(expr)) { // 找到所有文本
      CompileUtil['text'](node, this.vm, expr)
    }
  }
}

// 通过 CompileUtil，将 compileElement 和 compileText 中的实际编译内容拆分解耦，以后增加新的指令方法只需在 CompileUtil 中增加对应方法即可

/**
 * 编译工具
 */
CompileUtil = {
  /**
   * 根据表达式获取实例上对应的数据
   * @param {*} vm 
   * @param {*} expr 
   */
  getVal (vm, expr) {
    return expr.split('.').reduce((prev, next) => {
      return prev[next]
    }, vm.$data)
  },
  /**
   * 设置值，输入框使用
   * @param {*} vm 
   * @param {*} expr 
   */
  setVal (vm, expr, value) {
    expr.split('.').reduce((prev, next, currentIndex, arr) => { // 收敛
      if (currentIndex === arr.length - 1) {
        return prev[next] = value
      }
      return prev[next]
    }, vm.$data)
  },
  /**
   * 获取编译文本后的结果
   * @param {*} vm
   * @param {*} expr
   */
  getTextVal (vm, expr) {
    return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
      return this.getVal(vm, args[1])
    })
  },
  /**
   * 编译文本
   * @param {*} node 
   * @param {*} vm 
   * @param {*} expr 
   */
  text (node, vm, expr) { // 这里的 expr 是 插值表达式 {{person.name}} 形式，通过 getTextVal() 正则匹配后 getVal() 取值
    let updateFn = this.updater['textUpdater']
    // 增加观察者
    expr.replace(/\{\{(.+?)\}\}/g, (...args) => { // expr 是 插值表达式 {{person.name}} 形式，故需通过正则取出其文本值进行比较
      new Watcher(vm, args[1], () => {
        // 如果数据变化了，文本节点需要重新获取依赖的属性更新文本中的内容
        updateFn && updateFn(node, this.getTextVal(vm, expr)) // 更新视图
      })
    })
    updateFn && updateFn(node, this.getTextVal(vm, expr)) // 初始化视图
  },
  /**
   * 编译输入框
   */
  model (node, vm, expr) { // 这里的 expr 是 字符串 person.name 形式，正常 getVal() 取值
    let updateFn = this.updater['modelUpdater']
    // 增加观察者
    new Watcher(vm, expr, () => {
      updateFn && updateFn(node, this.getVal(vm, expr)) // cb 中监测到值变化时，再次调用此更新页面节点数据方法，实现页面数据更新
    })
    updateFn && updateFn(node, this.getVal(vm, expr)) // 数据初始化赋值（注意，这一步只是原始 data 中的数据在初始化页面时替换模板显示于页面，并未考虑更新）
    node.addEventListener('input', (e) => {
      let value = e.target.value // 获取用户输入的内容
      this.setVal(vm, expr, value)
    })
  },
  updater: {
    // 文本更新
    textUpdater (node, value) {
      node.textContent = value
    },
    // 输入框更新
    modelUpdater (node, value) {
      node.value = value
    }
  }
}