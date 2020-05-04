## 浅谈前端MVVM及其简单实现

### 1 什么是MVVM

​		`MVVM` 是 `Model-View-ViewModel` （模型-视图-视图模型）的缩写，其本质 `MVC` （`Model-View-Controller`）的改进版，将其中 `View` 前端视图层的状态和行为抽象化，以便将视图 `UI` 和业务逻辑分离。[1]

​		`MVVM` 中 `M`（`Model`，模型）指的是前端静态数据及后端传递数据，`V`（`View`，视图）指的是前端显示页面，`VM`（`ViewModel`，视图模型）是 `MVVM` 模式的核心，它是连接 `View` 与 `Model` 的桥梁。

​		在 `MVVM` 模式下，`View` 和 `Model` 是不能直接通信的，它们通过 `ViewModel` 来通信。`ViewModel` 有两个方向：

​		一是通过数据绑定，当 `Model` 数据发生变化时，`ViewModel` 的 `observer` 观察者监听到数据变化，然后通知对应 `View` 视图自动更新；

​		二是通过 `DOM` 事件监听，当用户操作视图时，`ViewModel` 的 `observer` 观察者监听到视图变化，然后通知对应的` Model` 数据改动。[2]

![1.1](assets/1.1.jpg)

​		通过 数据绑定和 `DOM` 事件监听，`MVVM` 模式实现了 `View` 和 `View` 的互相通信，即数据的双向绑定。

### 2 为什么会产生MVVM

​		1989 件，欧洲核子研究中心的物理学家 Tim Berners-Lee 发明了超文本标记语言（`HyperText Markup Language`），简称`HTML`，并在 1993 年成为互联网草案。

​		最早的 `HTML` 页面是完全静态的网页，它们是预先编写好的存放在 `Web` 服务器上的 `html` 文件。浏览器请求某个 `url` 时，`Web` 服务器把对应的 `html` 文件 传递给浏览器，显示 `html` 文件内容。

​		如果需要针对不同的用户显示不同的页面，不可能给成千上万的用户准备成千上万的 `html` 文件。所以，服务器需要针对不同的用户，动态生成不同的 `html` 文件。而在 `html` 文件中，大多数字符串都是不变的 `HTML` 片段，变化的只有少数和用户相关的数据，所以出现了创建动态 `HTML` 的方式：`ASP`、`JSP` 和 `PHP`。

​		在 `PHP` 中，一个 `PHP` 文件就是一个 `HTML` 页面，需要替换的变量用特殊的 `<?php ?>` 标记出来，再配合循环、条件判断等，动态创建出`HTML`。

​		但是，浏览器显示了一个 `HTML` 页面，一旦需要更新内容，唯一的方法就是重新向服务器获取一份新的 `HTML` 内容。直到 1995 年底，`JavaScript` 被引入到浏览器后，浏览器可以通过 `JavaScript` 对页面进行一些修改。`JavaScript` 还可以通过修改 `HTML` 的 `DOM` 结构和 `CSS` 来实现一些动画效果，这些功能无法通过服务器完成，必须在浏览器实现。

​		JavaScript 可以使用浏览器提供的原生 `API`，直接操作 `DOM` 节点。但是原生 `API` 并不好用，且有浏览器兼容性问题。`JavaScript` 库 `JQuery` 出现后，已其简洁的 `API` 迅速推广。

​		现在，由于前端开发混合了 `HTML`、`CSS` 和 `JavaScript`，且前端页面越来越复杂，用户对于交互性的要求也原来越高，导致代码的组织和维护难度更加复杂，`MVVM` 应运而生。

​		`MVVM` 借鉴了 `MVC` 分层开发的思想，在前端页面中，把 `Model` 用 纯 `JavaScript` 对象表示，`View` 负责显示，做到最大限度的分离。两者通过 `ViewModel` 相关联，`ViewModel` 负责把 `Model` 的数据同步到 `View` 显示，还负责把 `View` 的修改同步回 `Model`。

​		使用  `JQuery` 和 `MVVM` 操作 `DOM` 节点的对比：

```html
<!-- HTML -->
<p>Hello, <span id="name">Zhangsan</span></p>
<p>You are <span id="age">12</span></p>
```

​		使用 `JQuery` 修改 `name` 和 `age` 节点的内容：

```javascript
// JQuery
let name = 'Lisi'
let age = 13

$('#name').text(name)
$('#age').text(age)
```

​		使用 `MVVM` 修改 `name` 和 `age` 节点的内容：

```javascript
// Model 中的 person 与 View 中的 DOM 节点相关联
let person = {
      name: 'zhangsan',
      age: 12
}

// MVVM
person.name = 'lisi'
person.age = 13
```

​		由此可见，`MVVM` 并不关心页面的 `DOM` 结构，而是关心数据如何存储。修改页面内容是并不操作 `DOM`，而是直接修改数据内容。这让我们的关注点从如何操作 `DOM` 变为了 如何更新数据的状态，而操作数据状态比操作 `DOM` 简单的多。`MVVM` 模式的使用将开发者从繁琐的 `DOM` 操作中解脱出来。[3]

### 3 MVVM优缺点

#### 3.1 MVVM的优点

- **自动更新 DOM**

  利用双向绑定，数据更新后视图自动更新，将开发者从繁琐的手动 `DOM` 中解放。

- **降低代码耦合**

  分离 `View` 和 `Model`，降低代码耦合。当 `View` 变化的时候，`Model` 可以不变；当 `Model` 变化的时候， `View` 也可以不变。

- **提高可重用性**

  一个 `ViewModel` 可以绑定到不同的 `View` 上，让很多 `View` 重用这段 `ViewModel`。

- **提高可测试姓**

  `ViewModel` 的存在可以帮助开发者更好的编写测试代码。

#### 3.2 MVVM的缺点

- **Bug难被调试**

  由于采用双向绑定模式，当界面异常时，有可能是 View 的代码有问题，也有可能是 `Model` 代码有问题。数据绑定使得一个位置的 `Bug` 快速被传递到了另一个位置，定位原位置变得困难。另外，由于数据绑定的声明是指令式的写在 `View` 模板中，这些内容无法采用 `debug` 断点调试。

- **占用内存多**

  一个大的模块中的 `model` 也会很大，虽然使用方便也很容易保证了数据的一致性，但是长期持有，不释放内存造成耗费很多内存。

- **维护成本提高**

  对于大型的图形应用程序，视图状态较多，`ViewModel` 的构建和维护成本提高。[4]

### 4 MVVM简单实现

​		本部分MVVM框架主要分为三部分，Compile 模板编译、 Observer 数据劫持与发布订阅连接视图与数据。

![4](assets/4.jpg)

​		本部分为代码按步实现过程，完整代码见 **5 完整代码**。

#### 4.1 创建并使用 MVVM 对象

​		首先，创建一个 MVVM对象，并在模板中引入。MVVM是连接 Compiler 模板编译与 Observer 数据劫持的桥梁。

##### 4.1.1 创建 MVVM 对象

​		创建 MVVM 对象并将属性绑定在实例上。

```javascript
// MVVM.js

class MVVM {
  constructor (options) {
    // 一般情况下，在写库或者框架时，都需要将属性挂载到实例上，保证其原型或方法能够取到该属性
    this.$el = options.el
    this.$data = options.data
  }
}
```

##### 4.1.2 在模板中使用 MVVM 对象

​		在模板中引入 MVVM 对象并实例化

```html
<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div id="app">
    <input type="text" v-model="person.name">
    <div>{{person.name}}</div>
    {{person.name}}{{person.age}}
  </div>
    
  <script src="./MVVM.JS"></script>
  <script>
    // 实例化 MVVM 对象
    let vm = new MVVM({
      el: '#app',
      data: {
        person: {
          name: 'zhangsan',
          age: 12
        }
      }
    })
  </script>
</body>
</html>
```

#### 4.2 Compiler 模板编译

​		完成 **4.1 创建并引入 MVVM 对象** 后，页面显示的是模板字符串，需采用 Compiler 模板编译，将模板字符串内容替换为实例数据。

##### 4.2.1 创建并使用 Compiler 对象

​		创建 Compiler 对象 并在 MVVM 对象中使用，由于需要对文档 DOM 中模板内容使用实例中的数据进行替换，故在 Compiler 中引入文档节点 el 与实例 vm（this）。

###### 4.2.1.1 创建 Compiler 对象

​		用户在传入 el 时，可能会传入 '#app' 或document.getElementById('app') 形式，对此，需进行是否是节点判断。

​		为实现解耦，将 Compiler 对象的方法整体氛围三部分：核心方法、辅助方法、编译工具。核心方法主要用来真实替换模板与数据，辅助方法用来进行是判断否是元素、是否是文本及提取指令等操作。

```javascript
// Compiler.js

class Compiler {
  constructor (el, vm) { // el 为模板，vm 为 this 实例
    // el 的值可能是字符串 '#app'，也有可能是元素 document.getElementById('#app')
    // 判断 el属性 是否是元素，如果不是元素，则获取它
    // 为了扩展时所有类的属性都能在原型上取到，将所有值都绑定到实例上
    this.el = this.isElementNode(el) ? el : document.querySelector(el)
    this.vm = vm
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
```

###### 4.2.1.2 在 MVVM 对象 中使用 Compiler 对象

​		引入 Compiler 对象后的 MVVM 对象如下，此时需注意，只有在用户传入 DOM 节点即 this.$el 为 true 时才进行编译。

```js
// MVVM.js

class MVVM {
  constructor (options) {
    this.$el = options.el
    this.$data = options.data

    // 如果有需要编译的模板，则开始编译
    if (this.$el) {
      // 用数据和元素进行编译
      new Compiler(this.$el, this) // 后期 this 上可能会有很多属性，this.$el 模板中也需要很多属性而不仅仅是 this.$data，所以此处使用范围更广的 this
    }
  }
}
```

##### 4.2.2 编译执行

​		在匹配 data 时，如果每匹配到一个数据就渲染一次，会造成页面不停的回流与重绘，可先将模板放入内存中，在内存中完全替换完毕后，再放回页面，性能比每匹配到一个就替换性能更佳。此部分主要分为三步：

​	1. 将真实 DOM 节点放入内存；2. 在内存内对模板内容进行替换；3. 替换好的节点重新渲染回页面

```javascript
// Compiler.js

class Compiler {
  constructor (el, vm) {
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
}
```

###### 4.2.2.1 将真实 DOM 节点放入内存

​		此处注意 appendChild 的移动性，其在将页面 DOM 节点移入内存中的同时，会将页面中原有节点移除。

```javascript
// Compiler.js

class Compiler {
    
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
}
```

###### 4.2.2.2 在内存内对模板内容进行替换

​		注意在遍历节点时，对于元素节点，其还有可能存在子元素及更深层内容，此时需要递归检查。编译主要分为编译元素（含 'v-' 指令）部分和编译文本两部分。

​		 这一步只是原始 data 中的数据在初始化页面时替换模板显示于页面，即初始化赋值，并未考虑更新。

```javascript
// Compiler.js

class Compiler {
    
  /**
   * 核心方法
   */

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
}
```

​		**编译元素**

```javascript
// Compiler.js

class Compiler {
  /**
   * 核心方法
   */
  
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
  }
  },
  /**
   * 编译输入框
   * @param {*} node 
   * @param {*} vm 
   * @param {*} expr 
   */
  model (node, vm, expr) { // 这里的 expr 是 字符串 person.name 形式，正常getVal()取值
    let updateFn = this.updater['modelUpdater']
    updateFn && updateFn(node, this.getVal(vm, expr)) // 数据初始化赋值（注意，这一步只是原始 data 中的数据在初始化页面时替换模板显示于页面，并未考虑更新）
  },

  updater: {
    // 输入框更新
    modelUpdater (node, value) {
      node.value = value
    }
  }
}
```

​		**编译文本**

```javascript
// Compiler.js

class Compiler {
    
  /**
   * 核心方法
   */

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
    expr = this.getTextVal(vm, expr)
    updateFn && updateFn(node, expr)
  },
  updater: {
    // 文本更新
    textUpdater (node, value) {
      node.textContent = value
    }
  }
}
```

###### 4.2.2.3 替换好的节点重新渲染回页面

```javascript
// Compiler.js

class Compiler {
  constructor (el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el)
    this.vm = vm
    if (this.el) {
      let fragement = this.node2fragement(this.el)
      this.compile(fragement)
      // 把编译好的 fragement 放回页面中
      this.el.appendChild(fragement)
    }
  }
}
```

​		至此，模板编译基本逻辑结束。

#### 4.3 Observer 数据劫持

##### 4.3.1 创建并使用 Observer 对象

​		在编译前进行响应式定义（数据劫持），即将对象所有属性改为 get 和 set 方法。 创建 Compiler 对象并在 MVVM 对象中使用，由于需要响应式定义的数据存在于 data 属性上，故在 Observer 中引入实例 数据 vm.data （this.$data）。

###### 4.3.1.1 创建 Observer 对象

```javascript
// Observer.js

class Observer {
  constructor (data) {
      
  }
}
```

###### 4.3.1.2 在 MVVM 对象中使用 Observer 对象

```javascript
// MVVM.js

class MVVM {
  constructor (options) {
    this.$el = options.el
    this.$data = options.data

    if (this.$el) {
      //  数据劫持（观察对象，给对象添加 Object.defineProperty，把数据全部转化为用 Object.defineProperty 来定义）
      new Observer(this.$data)
      new Compiler(this.$el, this)
    }
  }
}
```

##### 4.3.2 劫持数据

​		此处主要采用了 Object.defineProperty() 方法，以往我们采用的是 obj.key 取值， obj.key = value 赋值的形式，但是如果我们想在取值或赋值的时候进行其他操作，如弹窗，这种取值赋值方法是无法做到的。此时可采用 Object.defineProperty()，这里我们采用此种形式，方便后期订阅发布事件的执行，以达到数据双向绑定。[5] [6]

​		另外，还需注意深层次数据的响应式劫持，故需进行深度递归。

```javascript
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
    // 以往我们采用的是 obj.key 取值， obj.key = value 赋值的形式，但是如果我们想在取值或赋值的时候进行其他操作，如弹窗，这种取值赋值方法是无法做到的。此时可采用 Object.defineProperty()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: () => { // 取值操作，代替 obj.key
        return value
      },
      set: (newValue) => { // 赋值操作，代替 obj.key = value
        this.observe(newValue) // 新值劫持（如果是对象，继续劫持）
        if (newValue !== value) value = newValue
      }
    })
  }
}
```

​		至此，数据劫持基本逻辑结束。

#### 4.4 发布订阅实现数据双向绑定

​		通过 **4.2 Compiler 模板编译** 与 **4.3 Observer 数据劫持** 已经完成了数据在页面的渲染和数据的响应式绑定，但此时还未将响应式数据与其在页面渲染相关联。

​		据此，可以采用观察者模式（发布订阅模式），当页面初次渲染时，为所有的数据绑定监听事件（订阅），当数据变化时，触发监听事件（发布），使用新数据渲染页面。由此实现数据的双向绑定。

##### 4.4.1 Watcher 订阅者

​		创建订阅者（观察者），即每个数据的监听对象，并使用于每个数据。

###### 4.4.1.1 创建 Watcher 对象

​		给需要变化的元素添加订阅者，将新值与老值进行比对，当数据变化时，执行对应的更新方法。

```javascript
// Watcher.js

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
    return expr.split('.').reduce((prev, next) => { //[9]
      return prev[next]
    }, vm.$data)
  }

  get () {
    let value = this.getVal(this.vm, this.expr)
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
```

###### 4.4.1.2 为数据绑定观察者

​		前面 Compiler.js 中，通过 updateFn 实现了将初始化数据代替页面模板数据而将 data 内容显示于页面，但在数据更新时并不能重新渲染页面数据。所以，可以在此处设置订阅者，使每个数据都有一个单独的订阅者（new Watcher），以在数据变化时重新渲染页面数据。

```javascript
// Compiler.js

/**
 * 编译工具
 */
CompileUtil = {
   /**
   * 编译文本
   */
  text (node, vm, expr) {
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
  model (node, vm, expr) {
    let updateFn = this.updater['modelUpdater']
    // 增加观察者
    new Watcher(vm, expr, () => {
      updateFn && updateFn(node, this.getVal(vm, expr)) // cb 中监测到值变化时，再次调用此更新页面节点数据方法，实现页面数据更新
    })
   	updateFn && updateFn(node, this.getVal(vm, expr)) // 初始化视图
  }
}
```

##### 4.4.2  Dep 发布者

​		通过 **4.4.1 Watcher 订阅者** 为每个数据实例化了一个 watcher，其中的更新方法 update 只有在数据变化时才会更新。此时需要进行订阅的发布，以获取到所有的 watcher 并在数据变化时进行依次更新。

###### 4.4.2.1 创建 Dep 对象

```javascript
// Observer.js

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
```

###### 4.4.2.2 使用 Dep，订阅发布，连接视图与数据

​		我们使用发布订阅的目的是在数据或页面变化时更新响应的页面或数据，而在初始化时已经创建了每个数据的 watcher，但绑定到数据上。所以，我们可以在初始化（get 取值）时，为每个数据定义一个发布者，并存储其监听 watcher，在数据变化（set 赋值）时，调用 watcher 进行发布，实现更新。

```javascript
// Observer.js

class Observer {
   /**
   * 定义响应式（数据劫持）
   */
  defineReactive(obj, key, value) {
    let dep = new Dep() // 每个变化的数据都会对应一个存放所有更新的数组
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: () => {
        Dep.target && dep.addSub(Dep.target) // 获取订阅者
        return value
      },
      set: (newValue) => {
        if (newValue !== value) {
          this.observe(newValue)
          value = newValue
          dep.notify() // 通知数据更新
        }
      }
    })
  }
} 
}
```

​		同时，在订阅（new Watcher）时，要将 watcher 实例赋予发布者存储，以施行 update 发布更新。每次赋值完毕清空发布中的 watcher，以防影响下一个数据取值。

```javascript
// Watcher.js

class Watcher {
  get () {
    Dep.target = this // this 指 new 的 watcher 实例
    let value = this.getVal(this.vm, this.expr)
    Dep.target = null
    return value
  }
}
```

​		至此，实现了一个简单的 MVVM 框架。

![4.4.2.2](assets/4.4.2.2.gif)

### 5 完整代码

#### 5.1 github 地址

​		https://github.com/trp1119/MVVM.git

#### 5.2 代码拆分

##### 5.2.1 index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div id="app">
    <input type="text" v-model="person.name">
    <div>{{person.name}}</div>
    {{person.name}}{{person.age}}
  </div>
  <script src="./Dep.js"></script>
  <script src="./Watcher.js"></script>
  <script src="./Observer.js"></script>
  <script src="./Compiler.js"></script>
  <script src="./MVVM.JS"></script>
  <script>
    // 实例化 MVVM 对象
    let vm = new MVVM({
      el: '#app',
      data: {
        person: {
          name: 'zhangsan',
          age: 12
        }
      }
    })
  </script>
</body>
</html>
```

##### 5.2.2 MVVM.js

```javascript
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
```

##### 5.2.3 Compiler.js

```javascript
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
    return node.nodeType === 1 // [7]
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
    let fragement = document.createDocumentFragment() // 创建文档碎片，存放于内存中 [8]
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
```

##### 5.2.4 Observer.js

```javascript
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
```

##### 5.2.5 Watcher.js

```javascript
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
```

##### 5.2.6 Dep.js

```javascript
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
```

### 6 参考资料

[1] MVVM [EB/OL]. (2019-12-04)[2020-05-04]. https://baike.baidu.com/item/MVVM/96310?fr=aladdin.

[2] 隔壁老主. 由浅入深讲述MVVM [EB/OL]. (2019-03-18)[2020-05-04]. https://www.cnblogs.com/wzfwaf/p/10553160.html.

[3] 廖雪峰. MVVM[EB/OL]. [2020-05-04]. https://www.liaoxuefeng.com/wiki/1022910821149312/1108898947791072.

[4] 前端问答. MVVM的优缺点？[EB/OL].  (2019-11-24)[2020-05-04].  https://developer.aliyun.com/ask/259836?groupCode=othertech

[5] 赵望野, 梁杰. 你不知道的JavaScript（上卷）[M]. 北京: 人民邮电出版社, 2015: 111-119.

[6] Object.defineProperty() [EB/OL]. (2020-03-02)[2020-05-04]. https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty.

[7] Node.nodeType [EB/OL]. (2019-07-28)[2020-05-04]. https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType

[8] Document.createDocumentFragment() [EB/OL]. (2019-03-23)[2020-05-04]. https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createDocumentFragment

[9] Array.prototype.reduce() [EB/OL]. (2020-04-29)[2020-05-04]. https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce