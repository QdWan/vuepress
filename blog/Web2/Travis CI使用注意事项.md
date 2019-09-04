## Travis CI使用注意事项

### endpoint导致解密文件失败

```js
cat ~/.travis/config.yml
```

查看repo对应的endpoint，确定是在`travis.org`还是`travis.com`，如果endpoint和对应CI不一致，会导致CI时decrypt失败，例如：endpoint为`travis.org`，encrypt了`id_rsa`，如果触发了`travis.com`中执行CI，会导致decrypt失败。



### SSH

```js
ssh-keygen -t rsa -C "your_email@example.com"
travis encrypt-file ~/.ssh/id_rsa --add
```

