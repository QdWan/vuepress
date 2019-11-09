## Kubernetes

```bash
swapoff -a
cd /etc/default && vim grup
GRUP_CMDLINE_LINUX="cgroup_enable=memory"
update-grub2
reboot

{ "exec-opts": ["native.cgroupdriver=systemd"] } // /etc/docker/daemon.json
systemctl daemon-reload
systemctl restart docker

swapoff -a

apt install systemd-sysv
reboot
apt-get remove virtualbox-6.0

minikube start --vm-driver=none --image-repository=registry.cn-hangzhou.aliyuncs.com/google_containers
```

```bash
export HTTP_PROXY=http://(your_host_machine_ip)192.168.99.1:1087
export NO_PROXY=minikube_ip
minikube start --vm-driver=virtualbox
```

```bash
kubectl cluster-info
kubectl version
kubectl get no
kubectl run nginx --image=nginx:1.7.9
kubectl get deploy
kubectl get deploy nginx
kubectl describe deploy nginx
kubectl get rs
kubectl describe rs
kubectl get po
kubectl get po nginx-b8dcdd49d-44cmk -o wide
kubectl logs nginx-b8dcdd49d-44cmk
kubectl exec -it nginx-b8dcdd49d-44cmk /bin/bash
kubectl create -f nginx.svc.yaml
kubectl get svc
kubectl expose deploy nginx --type=NodePort --name=nginx-ext --port=80
kubectl delete svc nginx-ext
kubectl get ep
kubectl scale deploy nginx --replicas=3
kubectl get deploy nginx
kubectl get rs
kubectl get po
kubectl get ep
kubectl set image deploy nginx nginx=nginx:1.9.1
kubectl rollout status deploy nginx
kubectl rollout history deploy nginx
kubectl describe deploy nginx
kubectl get rs
kubectl set image deploy nginx=nginx:1.95 // error
kubectl rollout history deploy nginx
kubectl rollout history deploy nginx --revision=3
kubectl get rs
kubectl describe rs nginx-{hashstr}
kubectl get po
kubectl describe po
curl http://192.168.99.101:30001
kubectl rollout undo deploy nginx
kubectl get rs
kubectl get po
kubectl get ep
kubectl delete po nginx-pohashnum
kubectl get ep
kubectl get po
```

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
  - name: http
    port: 8888
    nodePort: 30001
    targetPort: 80
  selector:
    run: nginx
  type: NodePort
```

