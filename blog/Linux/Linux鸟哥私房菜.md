---
sidebar: auto
title: 'Linux鸟哥私房菜'
---

# Linux鸟哥私房菜

## 第10章

### 认识Bash这个shell

#### Bash的功能

- 历史命令
  - `~/.bash_history`中存储着历史命令，可能存在黑客入侵，利用该命令查找到系统相关的操作，例如：在命令行中直接输入MySQL密码。 
- 命令别名设置功能
  - `alias lm='ls -al'`
  - `unalias lm`

#### 查询命令是否为Bash shell的内置命令

```bash
type [-tpa] name
```

#### 命令的执行与快速编辑按钮

```bash
cp /var/spool/mail/root \
> /etc/fstab/root
```

需要注意上述命令中的符号`\`，其后面没有空格，如果加上了空格，则反斜杠将转义空格键而不是Enter键。

如果命令行太长并且需要删除时：

- ctrl + u：从光标处向前删除
- ctrl + k：从光标处向后删除
- ctrl + a：将光标移动到最前面
- ctrl + e：将光标移动到最后面