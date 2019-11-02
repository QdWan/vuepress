## Cypress

### Dom元素选择

- 采用了JQuery选择元素的方式，开发者可以使用大部分JQuery的API，具有良好的可读性。
- cypress获取元素的返回值和jquery有所区别：

```js
// you can get the element in jquery
const $jqueryElement = $('.element')

// you cannot get the element in cypress, because cy dont return element synchronously
const $cyElement = cy.get('.element')
```

- 当cypress找不到dom节点时，会自发的重复寻找直到找到为止，你也可以指定timeouts。这使得测试用例的编写可以减少很多条件语句去判断、等待dom节点的存在。
- timeout值可以在cypress.json的`defaultCommandTimeout`中进行全局配置。



#### 最佳实践

- 选择元素时尽量采用不易变的属性，例如：可以为元素增加`data-*或data-cy`属性供cypress选择。

- 何时使用`cy.contains()`：当text content的变动会影响测试结果时。



### 链式指令

- 对Dom进行操作时，cypress会考虑节点状态，例如：元素的可见性、disable属性等对click()会造成影响。可以指定`force`选项，重载该行为。
- 可通过assertions来对dom是否具有某种属性、类名、值等进行判断。
- 并非所有方法都可被链式调用，例如`cy.clearCookies()`的yield值为null。