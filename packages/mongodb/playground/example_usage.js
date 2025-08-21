const dbConnection = require('../../../db_connection');

// 使用示例
async function exampleUsage() {
  console.log('=== MongoDB 连接类使用示例 ===\n');

  try {
    // 1. 连接数据库
    console.log('1. 连接数据库...');
    const connection = await dbConnection.connectMongoose();
    console.log('✅ 连接成功\n');

    // 2. 获取连接信息
    console.log('2. 获取连接信息...');
    const connectionInfo = dbConnection.getConnectionInfo();
    console.log('连接信息:', connectionInfo);
    console.log('连接状态:', dbConnection.getConnectionStatus());
    console.log('连接是否有效:', dbConnection.isConnectionValid());
    console.log('');

    // 3. 健康检查
    console.log('3. 执行健康检查...');
    const isHealthy = await dbConnection.healthCheck();
    console.log('健康状态:', isHealthy ? '正常' : '异常\n');

    // 4. 获取数据库集合
    console.log('4. 获取数据库集合...');
    if (connection && connection.connection) {
      const collections = await connection.connection.db.listCollections().toArray();
      console.log(`找到 ${collections.length} 个集合:`);
      collections.slice(0, 5).forEach(col => {
        console.log(`  - ${col.name}`);
      });
      if (collections.length > 5) {
        console.log(`  ... 还有 ${collections.length - 5} 个集合`);
      }
      console.log('');
    }

    // 5. 测试原生驱动连接
    console.log('5. 测试原生驱动连接...');
    const nativeClient = await dbConnection.connectNative();
    const db = dbConnection.getDatabase();
    console.log('原生驱动数据库名称:', db.databaseName);
    console.log('');

    // 6. 断开连接
    console.log('6. 断开连接...');
    await dbConnection.disconnect();
    console.log('✅ 连接已断开\n');

    console.log('🎉 所有示例执行完成！');

  } catch (error) {
    console.error('❌ 示例执行失败:', error.message);
  }
}

// 运行示例
if (require.main === module) {
  exampleUsage().catch(console.error);
}

module.exports = { exampleUsage };
