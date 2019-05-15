---
title: 'async原理'
---

# async原理

在说明async原理之前，介绍一个网站：[babel转换](<https://www.babeljs.cn/repl/#?babili=false&browsers=&build=&builtIns=false&code_lz=GYVwdgxgLglg9mAVAAgIYAoCUBvAUM5ASAgQGc4AbAUwDoK4BzdARk10IE8YqKATZZviIkw5anUboATGwKdufZFNwBfIA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=true&fileSize=false&lineWrap=false&presets=es2015%2Clatest%2Creact%2Cstage-2&prettier=true&targets=&version=6.26.0&envVersion=>)。在这里输入任何代码，会自动用babel为你转化出结果。

接下来输入以下代码:

```js
function* a(){
  	console.log(1)
	yield 1
}
```

来看看转换的结果:

```js
"use strict";

var _marked = /*#__PURE__*/ regeneratorRuntime.mark(a);

function a() {
  return regeneratorRuntime.wrap(
    function a$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            console.log(1);
            _context.next = 3;
            return 1;

          case 3:
          case "end":
            return _context.stop();
        }
      }
    },
    _marked,
    this
  );
}

```

可以看到当我们定义一个Generator函数时，其实会转换成上面代码。

现在再加多两行代码，看看转换的结果

```js
function* a(){
  	console.log(1)
	yield 1
  	console.log(2)
  	yield 2
}
```

```js
"use strict";

var _marked = /*#__PURE__*/ regeneratorRuntime.mark(a);

function a() {
  return regeneratorRuntime.wrap(
    function a$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            console.log(1);
            _context.next = 3;
            return 1;

          case 3:
            console.log(2);
            _context.next = 6;
            return 2;

          case 6:
          case "end":
            return _context.stop();
        }
      }
    },
    _marked,
    this
  );
}
```

当我们增加了yield时，其实就是在switch中增加了一个标签，可以这么理解：当调用a()时，会先执行0标签中的代码，然后_context.next变为3，并将yield后面跟的数return出去，只有当我们显式调用next()，才会继续执行3标签中的代码。因此可以将Generator看出一个状态机，每一次调用next()。其状态都会进行一次改变。

现在我们可以看看async函数转换的结果了

```js
async function a () {
	await new Promise()
}
```

```js
"use strict";

// 第一部分
var a = (function() {
  var _ref = _asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                _context.next = 2;
                return new Promise();

              case 2:
              case "end":
                return _context.stop();
            }
          }
        },
        _callee,
        this
      );
    })
  );

  return function a() {
    return _ref.apply(this, arguments);
  };
})();

// 第二部分
function _asyncToGenerator(fn) {
  return function() {
    var gen = fn.apply(this, arguments);
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step("next", value);
            },
            function(err) {
              step("throw", err);
            }
          );
        }
      }
      return step("next");
    });
  };
}

```

我们将转换的结果分成两部分来看。

首先看第一部分，就是调用了第二部分定义的函数，这个函数的参数是regeneratorRuntime.mark的返回值。回头看看前面Generator转换的函数，发现regeneratorRuntime.mark其实就是生成一个Generator函数，因此可以将这一段代码:

```js
regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(
    function _callee$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            _context.next = 2;
            return new Promise();

          case 2:
          case "end":
            return _context.stop();
        }
      }
    },
    _callee,
    this
  );
}）
```

看成这样一段代码：

```js
function* _callee() {
    yield new Promise()
}
```

也就是说，babel将async函数变成了一个Generator，将await换成了yield，只不过await相当于内置执行器，这个就要看看第二部分了

现在看看第二部分

其实第二部分就是帮我们自动执行Generator，而不用调用next()。

```js
var gen = fn.apply(this, arguments);
```

这一行代码就是说，执行传进来的函数参数，也就是执行Generator。可以看成：

```js
var gen = _callee()
```

然后就返回一个Promise对象，我们知道async函数返回的就是Promise对象，接下来看看这个Promise对象做了什么：

```js
function step(key, arg) {
...
}
return step("next");
```

就是定义了一个名字为step的函数，并且执行这一个函数

看看step函数的具体实现：

```js
try {
  var info = gen[key](arg);
  var value = info.value;
} catch (error) {
  reject(error);
  return;
}
```

gen是执行_callee()的结果，也就是执行Generator函数的结果，gen[key\](arg)就相当于`gen[next]()`，也就是调用next()，将Generator变为下一个状态，然后value得到的是Generator中yield的结果。

```js
if (info.done) {
  resolve(value);
} else {
  return Promise.resolve(value).then(
    function(value) {
      step("next", value);
    },
    function(err) {
      step("throw", err);
    }
  );
}
```

紧接着判断Generator的状态是不是到了最后，我们知道最后的时候调用next，返回的done的值是true，如果到了最后的状态，就直接将值resolve出去，否则返回一个Promise，这个Promise的then就递归调用step，继续地改变Generator的状态。

小结：通过分析，我们可以总结出来，async/await的原理就是，将函数转变为一个Generator，并且自动执行这个Generator。



# 基于Generator简单实现async

```js
async function a (name) {
	await new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('zhong')
			resolve()
		}, 1000)
	})
	console.log(name)
}


var a = (function () {
    return spawn(function* _callee(name) {
        yield new Promise((resolve, reject) => {
					setTimeout(() => {
						console.log('zhong')
						resolve()
					}, 1000)
				})
        console.log(name)
    })  
}())

function spawn (fn) {
    return function() {
        var gen = fn.apply(this, arguments)
        return new Promise(function (resolve, reject) {
            function step (key) {
                try {
                    var info = gen[key]()
                    var value = info.value
                } catch(err) {
                    reject(err)
                }
                if (info.done) {
                    resolve(value)
                } else {
                    Promise.resolve(value).then(function (value) {
                        step('next')
                    })
                }
            }
            step('next')
        })
    }
}

a('lim')
```

