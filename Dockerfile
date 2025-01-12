# 第一阶段：使用 Node.js 构建前端应用
FROM node:18-alpine AS build

# 设置工作目录
WORKDIR /app

# 从远程仓库拉取代码
RUN apk add --no-cache git && \
    git clone https://github.com/BOCINPITY/video_stream.git . && \
    npm install && \
    npm run build

# 第二阶段：使用 Nginx 作为基础镜像
FROM nginx:stable-perl

# 复制构建后的文件到 Nginx 的默认静态文件目录
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露 Nginx 的默认端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
