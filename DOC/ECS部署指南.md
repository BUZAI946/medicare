# MediCare 阿里云 ECS (Windows Server) 部署指南

## 架构

```
用户浏览器 → http://你的公网IP
                ↓
         Nginx (端口 80)
         ├── /            → 前端静态文件 (dist/)
         └── /api/*       → 反向代理 → Spring Boot (端口 8080)
                                  ↓
                            MySQL (端口 3306)
```

## 第一步：ECS 安全组配置

阿里云控制台 → ECS → 安全组 → 添加规则：

| 端口 | 协议 | 说明 |
|------|------|------|
| 80 | TCP | 网站访问 |
| 8080 | TCP | 后端 API（可选，调试用）|
| 3306 | TCP | MySQL（建议仅允许 127.0.0.1）|

## 第二步：安装环境

### 2.1 安装 JDK 17

下载安装：https://adoptium.net/download/

安装后验证：
```cmd
java -version
```

### 2.2 安装 MySQL 8.0

下载安装：https://dev.mysql.com/downloads/installer/

- 安装时设置 root 密码为 `1234`
- 安装完成后导入数据：

```cmd
cd C:\your-project-path
mysql -u root -p1234 -e "CREATE DATABASE IF NOT EXISTS medicare CHARACTER SET utf8mb4"
mysql -u root -p1234 medicare < sql\medicare.sql
mysql -u root -p1234 medicare < sql\init_users.sql
```

### 2.3 安装 Nginx

下载：https://nginx.org/en/download.html （选 Windows 版本）

解压到 `C:\nginx`，后面配置。

## 第三步：部署后端

### 3.1 安装 Maven

下载：https://maven.apache.org/download.cgi

解压后把 `bin` 目录加到系统 PATH。

### 3.2 构建并启动

```cmd
cd C:\your-project-path\medicare-server
mvn clean package -DskipTests
java -jar target\medicare-server-1.0.0-SNAPSHOT.jar
```

验证：http://localhost:8080/api/dashboard/stats

### 3.3 设置开机自启（可选）

用 Windows 任务计划程序，或者用 NSSM 把 jar 注册为 Windows 服务。

## 第四步：部署前端

### 4.1 上传 dist 文件

把本地 `medicare-web\dist\` 整个文件夹上传到 ECS 的 `C:\nginx\html\medicare\`。

### 4.2 配置 Nginx

编辑 `C:\nginx\conf\nginx.conf`：

```nginx
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile      on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  _;

        # 前端静态文件
        location / {
            root   C:/nginx/html/medicare;
            index  index.html;
            try_files $uri $uri/ /index.html;
        }

        # 后端 API 代理
        location /api/ {
            proxy_pass http://localhost:8080;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### 4.3 启动 Nginx

```cmd
cd C:\nginx
start nginx
```

## 第五步：验证

浏览器打开 `http://你的ECS公网IP`

| 账号 | 密码 | 角色 |
|------|------|------|
| admin | admin123 | 管理员 |

## 常用命令

```cmd
# 重启 Nginx
C:\nginx\nginx.exe -s reload

# 停止 Nginx
C:\nginx\nginx.exe -s stop

# 查看端口占用
netstat -ano | findstr :80
```

## 问题排查

| 问题 | 解决 |
|------|------|
| 80 端口不通 | 检查安全组 + Windows 防火墙 |
| 连不上 MySQL | 确认 MySQL 服务已启动 |
| Nginx 403 | 检查 nginx.conf 里的路径用正斜杠 |
| 页面空白 | F12 看 Network 面板，确认 API 请求能到 /api |
