## Docker命令

```bash
docker ps -a // 列出所有container
docker images // 列出所有image
docker run -p 宿主机端口:容器端口 --name="为容器指定名称" ${image}
docker build -t limsanity/cr-pwa:v1 .

docker-compose build user-service // user-service是服务名
docker-compose run user-service
```

