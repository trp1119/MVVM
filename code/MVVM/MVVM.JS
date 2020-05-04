// MVVM是连接 Compiler 模板编译与 Observer 数据劫持的桥梁

class MVVM {
  constructor (options) {
    // 一般情况下，在写库或者框架时，都需要将属性挂载到实例上，保证其原型或方法能够取到该属性
    this.$el = options.el
    this.$data = options.data

    // 如果有需要编译的模板，则开始编译
    if (this.$el) {
      //  数据劫持（观察对象，给对象添加 Object.defineProperty，把数据全部转化为用 Object.defineProperty 来定义）
      new Observer(this.$data)
      // 用数据和元素进行编译
      new Compiler(this.$el, this) // 后期 this 上可能会有很多属性，this.$el 模板中也需要很多属性而不仅仅是 this.$data，所以此处使用范围更广的 this
    }
  }
}