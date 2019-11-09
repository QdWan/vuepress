## Docker命令

```bash
docker ps             # 列出所有正在运行的container
docker ps -a          # 列出所有container，包括未运行
docker ps -a -q       # 列出所有container的id（静默模式）
docker rm containerId # 删除指定id的container

docker images         # 列出所有image,过滤了中间映像层
docker images -a      # 含中间映像层
docker images -a -q   # 列出所有镜像的id
docker rmi imagesId   # 删除指定id的镜像

# 根据指定镜像生成并运行container，-p指定端口 --name指定容器名字
docker run -p 宿主机端口:容器端口 --name=hello-world limsanity3/hello-world 

# 构建镜像，-t指定标签
docker build -t limsanity3/hello-world .

# 构建docker-compose.yaml中指定服务的镜像
docker-compose build user-service

# 运行docker-compose.yaml中指定的服务
docker-compose run user-service
```

