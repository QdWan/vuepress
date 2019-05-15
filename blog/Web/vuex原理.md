---
title: 'vuex原理'
---

## vuex如何注入到组件中

以下分析部分源码已删减

### Vue.use(Vuex)

```js
// Vue.use
Vue.use = function (plugin) {
	// ...
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    }
    // ...
    return this
};
```

这是Vue.use的源码，当我们将Vuex作为参数传入的时候，它会执行Vuex中的install函数。

```js
// Vuex.install
function install (_Vue) {
    // ...
  applyMixin(Vue);
}
```

install函数就会执行applyMixin函数

```js
// applyMixin
function applyMixin (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  }
  // ...
    
  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
}
```

applyMixin通过Vue.mixin将vuexInit函数混入到beforeCreate阶段，也就是说在组件处于beforeCreate的时候，就会调用vuexInit，vuexInit就会对this.$store进行赋值，options.store就是我们自己传入的store。到这里就知道了，vuex其实就是在组件beforeCreate阶段为this.\$store进行赋值的，因此我们可以通过this.\$sotre进行数据的访问。



## vuex如何实现响应式更新

```js
var prototypeAccessors$1 = { state: { configurable: true } };

prototypeAccessors$1.state.get = function () {
  return this._vm._data.$$state
};

// ..

Object.defineProperties( Store.prototype, prototypeAccessors$1 );
```

Vuex中，将prototypeAccessors\$1赋给Store的prototype，在prototypeAccessors\$1中定义了state属性的get方法，也就是说访问state的时候，其实是访问this.\_vm._data.\$​\$state。

```js
store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
});
```

上面就是store.\_vm的定义，它是一个Vue实例，并且其data属性存储的就是我们定义的state，我们知道Vue实例中的data是响应式的，当state中的值发生变化之后，会通知它的订阅者进行改变。