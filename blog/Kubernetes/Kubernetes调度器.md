# Kubernetes调度器

## 调度概述

一个调度器观察新创建并且未被分配Node的Pods。对于每个被调度器发现的Pod，调度器将负责为其寻找最优的Node。调度器将按下述原则实行调度。

## kube-scheduler

kube-scheduler是Kubernetes默认调度器。你可以设计并使用自己的调度器组件。

对于每个新的或未调度的pods，kube-scheduler为其选择一个最佳的node。然而，每个pod中的容器都对资源有着不同的需求，并且每个pod也有不同的需求。因此，对于特定的调度需求需要对已存在的node进行过滤。

在一个集群中，满足一个Pod调度需求的Nodes成为可行nodes。如果没有一个node适合，pod将保持未调度状态直到调度器为其分配合适的node。

调度器为Pod寻找可行node，然后执行一些列函数为可行node进行评分，然后挑选分数最高的node。调度器通知API server这一决定的行为成为绑定。

个体和共同的资源需求、硬件、软件、约束策略、亲和性、反亲和性、本地数据、内在负载接口都会成为调度决定的因素。

## 使用kube-scheduler进行调度

kube-scheduler挑选node会经过两个步骤

1. 筛选
2. 评分

筛选步骤为Pod找到一系列合适的node。举个例子，PodFitsResources筛选器检查是否存在一个Node拥有足够可用的资源。经过这一步骤，通常可以得到不止一个Node，如果不存在合适的Node，Pod将不会被调度。

评分步骤将为筛选出来的Node进行评分，并选择一个最为合适的Node。

最后，kube-schduler将Pod