const Sequelize = require('sequelize')
const config = require('../config')

// 配置数据库链接并暴露所有数据模型

var sequelize = new Sequelize(config.db, config.dbuser, config.dbpass, {
  host: config.host,
  port: 3306,
  dialect: 'mysql',
  define: { charset: 'utf8mb4',freezeTableName: true, },
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  dialectOptions: {dateStrings: true, typeCast: true},
  // 校正时区为北京
  timezone: '+08:00',
});

sequelize
  .authenticate()
  .then(function() {
    console.log('mysql is running on port' + sequelize.config.port);
    sequelize.sync()
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });



const User = sequelize.import(__dirname + '/user.js')

module.exports = {
  User
}
