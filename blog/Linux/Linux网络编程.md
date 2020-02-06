---
sidebar: auto
title: Linux网络编程
---

# Linux网络编程

## 进程控制

### 进程的建立与运行

#### 进程的概念

```bash
cat file.txt
```

命令解释程序shell建立了一个进程来执行`cat`命令。

```bash
ls | wc -ll
```

该命令会使shell建立两个进程，并发运行命令`ls`和`wc`。把`ls`的输出通过管道送至字计数命令`wc`。

进程和程序的区别：

- 进程是动态的，程序是静态的。
- 多个进程可以并发执行一个程序。
  - 例如：多个用户可以同时运行编辑程序，但是对于每一个用户，此程序的执行都是一个单独的进程。

一个进程可以启动另一个进程，进程树的顶端是一个执行名为`init`的程序的控制进程，该进程是所有进程的祖先。

进程控制方面的系统调用：

- fork()
  - 通过复制调用进程来建立新的进程，它是最基本的进程建立操作。
- exec
  - 包括一系列的系统调用，每个系统调用都完成相同的功能，区别在于参数构造。
  - 用一个新的程序覆盖原内存空间，实现进程的转变。
- wait()
  - 提供了初级的进程同步措施，能使一个进程等待另一个进程，直到其结束为止。
- exit()
  - 终止一个进程的运行。

#### 进程的建立

新建立的进程称为子进程，原进程称为父进程。父进程和子进程并发执行，都从`fork()`后的语句开始执行。

`fork()`返回一个pid值，用于区分父子进程。父进程中pid被设置为正整数，子进程中pid为0。

```c
#include <stdio.h>
#include <unistd.h>

main() {
  pid_t pid;
  printf("Now only one process\n");
  printf("Calling fork...\n");
  pid = fork();
  if (!pid)
    printf("I'm the child\n");
  else if (pid > 0)
    printf("I'm the parent, child has pid %d\n", pid);
  else
    printf("Fork fial!\n");
}
```

#### 进程的运行

