---
title: 'CSS世界读书笔记'
---

## 关于width

- display: block的属性，如果没有设置width，那么宽度就会自动铺满容器，这里说的宽度指的是content + padding + border + margin。
- 当元素position为absolute时，该元素的一般宽度取决其自身的内容宽度，但是如果同时设置了该元素的left和right，那么该元素的宽度就取决于其最近的position不为static的父元素宽度。

- display: inline-block的元素的内容，会在其容器的宽度处自动换行，注意如果是连续的英文并不会换行。