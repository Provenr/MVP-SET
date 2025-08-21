# MongoDB 连接管理类

这是一个功能完整的 MongoDB 连接管理类，支持 Mongoose 和原生 MongoDB 驱动，包含连接池管理、健康检查、错误处理等功能。

## 功能特性

- ✅ **双重连接支持**: 同时支持 Mongoose 和原生 MongoDB 驱动
- ✅ **连接池管理**: 自动管理连接池大小和空闲连接
- ✅ **健康检查**: 定期检查数据库连接状态
- ✅ **错误处理**: 完善的错误处理和重连机制
- ✅ **加密配置**: 支持 AES 加密的数据库配置
- ✅ **连接状态管理**: 实时监控连接状态
- ✅ **自动重连**: 连接断开时自动重连

## 安装依赖

```bash
npm install
# 或
pnpm install
```

## 快速开始

### 基本使用

```javascript
const dbConnection = require('./db_connection');

async function example() {
  try {
    // 连接数据库
    const connection = await dbConnection.connectMongoose();
    console.log('连接成功！');

    // 执行数据库操作
    const collections = await connection.connection.db.listCollections().toArray();
    console.log('集合数量:', collections.length);

    // 断开连接
    await dbConnection.disconnect();
  } catch (error) {
    console.error('连接失败:', error.message);
  }
}
```

### 原生驱动使用

```javascript
const dbConnection = require('./db_connection');

async function nativeExample() {
  try {
    // 连接原生驱动
    const client = await dbConnection.connectNative();
    const db = dbConnection.getDatabase();

    // 执行操作
    const collections = await db.listCollections().toArray();
    console.log('集合数量:', collections.length);

    // 断开连接
    await dbConnection.disconnect();
  } catch (error) {
    console.error('连接失败:', error.message);
  }
}
```

## API 文档

### 连接方法

#### `connectMongoose()`

连接 MongoDB 使用 Mongoose

```javascript
const connection = await dbConnection.connectMongoose();
```

#### `connectNative()`

连接 MongoDB 使用原生驱动

```javascript
const client = await dbConnection.connectNative();
```

### 状态管理

#### `getConnectionStatus()`

获取当前连接状态

```javascript
const isConnected = dbConnection.getConnectionStatus();
```

#### `isConnectionValid()`

检查连接是否有效

```javascript
const isValid = dbConnection.isConnectionValid();
```

#### `getConnectionInfo()`
获取详细连接信息
```javascript
const info = dbConnection.getConnectionInfo();
// 返回: { databaseName, readyState, host, port, isConnected }
```

### 健康检查

#### `healthCheck()`

执行数据库健康检查

```javascript
const isHealthy = await dbConnection.healthCheck();
```

### 重连功能

#### `reconnect()`

重新连接数据库

```javascript
await dbConnection.reconnect();
```

### 断开连接

#### `disconnect()`

断开所有连接

```javascript
await dbConnection.disconnect();
```

## 测试

### 运行完整测试套件

```bash
npm test
```

### 单独测试 Mongoose 连接

```bash
npm run test:mongoose
```

### 单独测试原生驱动连接

```bash
npm run test:native
```

### 运行使用示例

```bash
node example_usage.js
```

## 配置说明

数据库配置存储在 `utils/db_variable.json` 中，支持 AES 加密：

```json
{
  "host": "your-mongodb-host",
  "port": "27017",
  "username": "your-username",
  "password": "encrypted-password",
  "newDbUrl": "encrypted-connection-string"
}
```

## 连接选项

默认连接选项包括：

- `serverSelectionTimeoutMS`: 5000ms (服务器选择超时)
- `socketTimeoutMS`: 45000ms (Socket 超时)
- `connectTimeoutMS`: 10000ms (连接超时)
- `maxPoolSize`: 10 (最大连接池大小)
- `minPoolSize`: 1 (最小连接池大小)
- `maxIdleTimeMS`: 30000ms (最大空闲时间)
- `retryWrites`: true (重试写入)
- `w`: 'majority' (写入确认级别)

## 错误处理

连接类包含完善的错误处理机制：

- 连接失败时自动重试
- 网络中断时自动重连
- 详细的错误日志记录
- 优雅的错误恢复

## 事件监听

Mongoose 连接支持以下事件：

- `error`: 连接错误
- `disconnected`: 连接断开
- `reconnected`: 重新连接

## 注意事项

1. 确保数据库服务器可访问
2. 检查网络连接和防火墙设置
3. 验证数据库凭据是否正确
4. 在生产环境中使用适当的连接池大小

```bash
{
  "host": "",
  "password": "=",
  "newDbUrl": "xxxxxxx=",
  "port": "x",
  "username": "x",
}
```
