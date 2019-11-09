## 初识K8S

##### 部署一个Redis实例

```bash
kubectl run redis --image=redis:alpine
kubectl get all
kubectl get deploy redis -o wide
kubectl get rs -o wide
kubectl get svc -o wide

# 通过 kubectl expose 暴露 redis server
kubectl expose deploy redis --port=6379 --protocol=TCP --target-port=6379 --name=redis-server

# 通过 port-forwar 让集群外部访问
kubectl port-forward svc/redis-server 6379:6379

# 另一个本地终端
redis-cli -h 127.0.0.1 -p 6379
> ping
PONG
```



##### 部署一个Nginx实例

```bash
kubectl run nginx --image=nginx:1.7.9

kubectl get po
NAME                     READY   STATUS    RESTARTS   AGE
nginx-7d94864c84-bhlvp   1/1     Running   1          4d7h

# 进入容器
kubectl exec -it nginx-7d94864c84-bhlvp /bin/bash

# 暴露服务
kubectl expose deploy nginx --type=NodePort --name=nginx --port=80
```

