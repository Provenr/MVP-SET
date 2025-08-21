const dbConnection = require('../../../db_connection');

// 模拟测试 - 不实际连接数据库
async function testConnectionClass() {
  console.log('=== MongoDB 连接类功能测试 ===\n');

  try {
    // 1. 测试初始状态
    console.log('1. 测试初始状态...');
    console.log('连接状态:', dbConnection.getConnectionStatus());
    console.log('连接是否有效:', dbConnection.isConnectionValid());
    console.log('连接信息:', dbConnection.getConnectionInfo());
    console.log('');

    // 2. 测试配置获取
    console.log('2. 测试配置获取...');
    try {
      const config = dbConnection.getConnectionConfig();
      console.log('连接配置获取成功');
      console.log('配置长度:', config.length);
    } catch (error) {
      console.log('配置获取失败:', error.message);
    }
    console.log('');

    // 3. 测试连接选项
    console.log('3. 测试连接选项...');
    const options = dbConnection.getConnectionOptions();
    console.log('连接选项:', options);
    console.log('');

    // 5. 测试断开连接（即使没有连接）
    console.log('5. 测试断开连接...');
    await dbConnection.disconnect();
    console.log('断开连接完成');
    console.log('');

    // 6. 测试重连（即使没有连接）
    console.log('6. 测试重连...');
    try {
      const connection = await dbConnection.connectMongoose();
      console.log('重连尝试完成');
    } catch (error) {
      console.log('重连失败（预期）:', error.message);
    }
    console.log('');

    // 7. 获取数据库表
    console.log('7. 获取数据库表...');
    const connection = await dbConnection.connectMongoose();
    const collectionsList = await connection.connection.db.listCollections().toArray();
    console.log('数据库表:', collectionsList);
    console.log('');

    // 8.健康检查
    console.log('8. 健康检查...');
    const isHealthy = await dbConnection.healthCheck();
    console.log('健康状态:', isHealthy ? '正常' : '异常');
    console.log('');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
testConnectionClass().catch(console.error);
