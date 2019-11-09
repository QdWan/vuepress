# Kubernetes概念

## Kubernetes对象

### Pod

#### Pod Overview

Pod是K8S应用中可创建或部署的最小的单元，它是集群中运行的进程。Pod内部运行着一个或多个应用容器，拥有存储资源、独立的网络IP，管理着容器的应该如何运作。一个Pod代表着一个部署单元：K8S中的一个应用实例，该实例中包含了一个或多个紧密耦合的容器，这些容器共享着Pod中持有的资源。

Docker是Pod中最常用的容器运行时，但是Pod同时也支持其他[容器运行时](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)。

Pods在K8S集群中有两种使用方式：

- 运行单个容器的Pods。每个Pod对应一个容器的模型是最常见的；这种情况下，Pod就是容器的一层封装，K8S直接控制的是Pod而不是容器。
- 运行多个容器的Pods。一个Pod可以运行多个容器([同 Pod 内的容器使用共享卷通信使用案例](https://kubernetes.io/zh/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/))，这些容器共享资源。这些并置的容器可能形成一个从共享volume中对外serving文件的服务，而其中一个容器负责更新这些文件。Pod将这些容器和存储资源封装成一个独立可管理的实体。[Kubernetes Blog](https://kubernetes.io/blog/)中有一些其他关于Pod的用例。更多信息，请见：
  - [The Distributed System Toolkit: Patterns for Composite Containers](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns)
  - [Container Design Patterns](https://kubernetes.io/blog/2016/06/container-design-patterns)

每一个Pod意味着运行一个应用实例。如果你希望水平扩展你的应用，你应该使用多个Pods，每个对应一个实例。在K8S中，水平扩展Pod这一行为称作复制。复制的Pod通常被Controller这种抽象概念所创建和管理。更多详情请见[Pods and Controllers](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/#pods-and-controllers)。

##### Pod如何管理多个容器

Pod旨在使多个协作的容器形成一个内聚的服务单元。Pod中的容器在集群中相同的虚拟机或物理机上自动地并置和调度。容器共享资源和依赖，相互通信和协调何时以及如何终止。

将多个并置和共同管理的容器放在一个单独的Pod中是一个相对高级的用例。你应该在容器紧耦合的情况下使用这个模式。例如：你有一个用于serve文件的Web服务器容器和一个用于从远程更新这些文件的容器，这两个容器共享一个volume，情景如下图：

![](./img/concept/pod1.svg)



一些Pods拥有init容器和app容器。init容器在app容器启动前运行并结束。

Pods为容器提供了两种共享资源的方式：networking和storage。

##### Networking

每个Pod被分配一个独立的IP地址。每个Pod内的容器共享网络命名空间，包括IP地址和网络端口。Pod中的容器可以使用`localhost`和彼此通信。当容器和Pod外部的实体通信时，它们必须协调如何共享网络资源，例如端口。

##### Storage

一个Pod可以指定一组存储Volumes。所有容器可以访问共享volumes，允许容器共享数据。Volumes用于持久化Pod中的数据，即便其中一个容器需要重启，这些数据依然存在。详见[Volumes](https://kubernetes.io/docs/concepts/storage/volumes/)了解K8S如何实现Pod中的共享存储。

##### 使用Pod