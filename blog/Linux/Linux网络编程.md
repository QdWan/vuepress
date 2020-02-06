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

如果`exec`调用成功，调用进程将被覆盖，然后从新程序的入口开始执行。

`exec`并没有建立一个与调用进程并发的新进程，而是用新的进程取代了原来的进程。

`exec`系列调用在Linux系统库中unitstd.h中的函数声明：

- `int execl(const char *path, const char *arg, ...)`
- `int execlp(const char *file, const char *arg, ...)`
- `int execle(const char *path, const char *arg, ..., char *const envp[])`
- `int execv(const char *path, char *const argv[])`
- `int execvp(const char *file, char *const argv)`

`execl()`第一个参数给出了被执行的程序所在的文件名，文件本身必须是一个真正的可执行程序，不能✅一个shell命令组成的文件。系统只要检查文件的开头两个字节，就可以知道该文件是否为程序文件（程序文件的开头两个字节是系统规定的专用值）：

```c
#include <stdio.h>
#include <unistd.h>

main() {
  printf("Executing ls\n");
  execl("/bin/ls", "ls", "-l", NULL);
  
  perror("execl failed to run ls");
  exit(1);
}
```

上述例子中，如果`execl()`调用成功，将会运行ls程序替代当前的调用程序，就不会执行到`perror()`。

`execv()`的第一个参数指向执行的程序文件，第二个参数是一个参数列表数组：

```c
#include <stdio.h>
#include <unistd.h>

main() {
  char* av[] = { "ls", "-l", NULL };
  execv("/bin/ls", av);
  perror("execv failed");
  exit(1);
}
```

`execlp()`和`execvp()`分别类似于`execl()`和`execv()`，区别在于第一个参数为简单的文件名，而不是一个路径名，它们通过检索shell环境变量PATH指出的目录，来得到文件名的路径前缀，例如：

- `$PATH=/bin;/usr/bin;/sbin`
- `$export PATH`

首先会在目录`/bin`查找，然后在`/usr/bin`查找，最后在`/sbin`查找。另外，`execlp()`和`execvp`还可以运行shell程序，而不只是普通程序。

