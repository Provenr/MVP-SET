const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const dbVariable = require('./utils/db_variable.json');
const key = Buffer.from("I am a fool, OK?", "utf8");
const aesutil = require('./utils/aesutil');

class DatabaseConnection {
  constructor() {
    this.mongooseConnection = null;
    this.nativeClient = null;
    this.isConnected = false;
  }

  // 获取连接字符串
  getConnectionConfig() {
    const newDbUrl = dbVariable.newDbUrl;
    const decryptedUrl = aesutil.decryption(newDbUrl, key);
    console.log('decryptedUrl', decryptedUrl);
    return decryptedUrl;
  }

  // 获取连接选项
  getConnectionOptions() {
    return {
      serverSelectionTimeoutMS: 5000,  // 服务器选择超时
      socketTimeoutMS: 45000,          // Socket 超时
      connectTimeoutMS: 10000,         // 连接超时
      maxPoolSize: 10,                 // 连接池大小
      minPoolSize: 1,                  // 最小连接池大小
      maxIdleTimeMS: 30000,            // 最大空闲时间
      retryWrites: true,               // 重试写入
      w: 'majority'                    // 写入确认级别
    };
  }

  // 连接 MongoDB (使用 Mongoose)
  async connectMongoose() {
    try {
      if (this.isConnected) {
        console.log('Mongoose 已经连接');
        return this.mongooseConnection;
      }

      const connectionString = this.getConnectionConfig();
      console.log('connectionString', connectionString);
      const options = this.getConnectionOptions();

      console.log('正在连接 MongoDB (Mongoose)...');
      this.mongooseConnection = await mongoose.connect(connectionString, options);

      this.isConnected = true;
      console.log('✅ Mongoose 连接成功！');

      // 监听连接事件
      mongoose.connection.on('error', (error) => {
        console.error('Mongoose 连接错误:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('Mongoose 连接断开');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('Mongoose 重新连接');
        this.isConnected = true;
      });

      return this.mongooseConnection;
    } catch (error) {
      console.error('❌ Mongoose 连接失败:', error.message);
    }
  }

  // // 连接 MongoDB (使用原生驱动)
  async connectNative() {
    try {
      if (this.nativeClient) {
        console.log('原生客户端已经连接');
        return this.nativeClient;
      }

      const connectionString = this.buildConnectionString();
      const options = this.getConnectionOptions();

      console.log('正在连接 MongoDB (原生驱动)...');
      this.nativeClient = new MongoClient(connectionString, options);
      await this.nativeClient.connect();

      console.log('✅ 原生驱动连接成功！');
      return this.nativeClient;
    } catch (error) {
      console.error('❌ 原生驱动连接失败:', error.message);

      // 尝试副本集连接
      try {
        console.log('尝试使用副本集连接...');
        const replicaString = this.buildConnectionString(true);
        this.nativeClient = new MongoClient(replicaString, this.getConnectionOptions());
        await this.nativeClient.connect();
        console.log('✅ 副本集连接成功！');
        return this.nativeClient;
      } catch (replicaError) {
        console.error('❌ 副本集连接也失败:', replicaError.message);
        throw replicaError;
      }
    }
  }

  // 断开连接
  async disconnect() {
    try {
      if (this.mongooseConnection) {
        await mongoose.disconnect();
        console.log('Mongoose 连接已断开');
      }

      if (this.nativeClient) {
        await this.nativeClient.close();
        console.log('原生驱动连接已关闭');
      }

      this.isConnected = false;
      this.mongooseConnection = null;
      this.nativeClient = null;
    } catch (error) {
      console.error('断开连接时出错:', error.message);
    }
  }

  // 获取数据库实例
  getDatabase() {
    if (this.nativeClient) {
      return this.nativeClient.db();
    }
    throw new Error('原生客户端未连接');
  }

  // 获取 Mongoose 连接
  getMongooseConnection() {
    if (this.mongooseConnection) {
      return this.mongooseConnection;
    }
    throw new Error('Mongoose 未连接');
  }

  // 检查连接状态
  getConnectionStatus() {
    return this.isConnected;
  }

  // 获取连接信息
  getConnectionInfo() {
    if (this.mongooseConnection) {
      return {
        databaseName: this.mongooseConnection.connection.db.databaseName,
        readyState: this.mongooseConnection.connection.readyState,
        host: this.mongooseConnection.connection.host,
        port: this.mongooseConnection.connection.port,
        isConnected: this.isConnected
      };
    }
    return null;
  }

  isConnectionValid() {
    return this.isConnected &&
           this.mongooseConnection &&
           this.mongooseConnection.connection.readyState === 1;
  }

  // 健康检查
  async healthCheck() {
    try {
      if (this.mongooseConnection) {
        const adminDb = this.mongooseConnection.connection.db.admin();
        const result = await adminDb.ping();
        return result.ok === 1;
      }
      return false;
    } catch (error) {
      console.error('健康检查失败:', error.message);
      return false;
    }
  }
}

// 创建单例实例
const dbConnection = new DatabaseConnection();

module.exports = dbConnection;
