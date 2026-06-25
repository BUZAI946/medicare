# MediCare 智慧医疗门诊管理系统

基于 **Spring Boot + Vue 3** 的 Web 版智慧医疗门诊管理系统。

## ⚠️ 下载前必读

**这个项目不包含编译好的程序，下载后需要以下工具才能运行：**

| 工具 | 版本 | 下载 |
|------|------|------|
| JDK | 17+ | [Adoptium 下载](https://adoptium.net/) |
| Maven | 3.8+ | [Maven 下载](https://maven.apache.org/download.cgi) |
| MySQL | 8.0+ | [MySQL 下载](https://dev.mysql.com/downloads/installer/) |
| Node.js | 18+ | [Node.js 下载](https://nodejs.org/) |

> 装好上面 4 个工具后，按下面步骤操作。

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Spring Boot 3.2.5 + JPA |
| 前端 | Vue 3 + Element Plus + Vite |
| 数据库 | MySQL 8.0 |

## 启动步骤

### 1. 初始化数据库

MySQL 安装时记好 root 密码，然后：

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS medicare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 导入建表和数据
mysql -u root -p medicare < sql/medicare.sql

# 导入账号
mysql -u root -p medicare < sql/init_users.sql
```

> ⚠️ 如果 root 密码不是 `1234`，需要修改 `medicare-server/src/main/resources/application.yml` 里的 `password`。

### 2. 启动后端

```bash
cd medicare-server
mvn clean package -DskipTests
java -jar target/medicare-server-1.0.0-SNAPSHOT.jar
```

看到 `Started MediCareApplication` 就说明启动成功 → http://localhost:8080

### 3. 启动前端

```bash
cd medicare-web
npm install
npm run dev
```

→ http://localhost:5173

### 4. 登录

| 账号 | 密码 | 角色 |
|------|------|------|
| `admin` | `admin123` | 管理员 |
| `doctor1` | `doctor123` | 医生 |
| `pharmacist1` | `pharmacist123` | 药师 |

> 首次启动会自动把明文密码转为 BCrypt 加密。

## 数据库配置

默认连接（`medicare-server/src/main/resources/application.yml`）：

```yaml
datasource:
  url: jdbc:mysql://localhost:3306/medicare
  username: root
  password: 1234
```

## 项目结构

```
├── medicare-server/     # 后端 Spring Boot
├── medicare-web/        # 前端 Vue 3
├── sql/                 # 数据库脚本
├── DOC/                 # 项目文档
└── README.md
```

## 常见问题

- **数据库连不上？** → 检查 MySQL 是否启动、root 密码是否正确
- **8080 端口被占用？** → 改 `application.yml` 里的 `server.port`
- **前端 404？** → 确认后端已启动，前端代理指向 `localhost:8080`

更多细节见 [部署手册](DOC/部署手册.md)。
