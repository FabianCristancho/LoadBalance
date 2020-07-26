const mysql = require('mysql');

module.exports = () => {
  return mysql.createConnection({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    //host: 'db', //Para container
    port: 3306,
    user: 'root',
    password: '',
    // password: 'admin123', //Para container
    database: 'load_balance_images'
  });
}