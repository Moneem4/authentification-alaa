const mysql = require("mysql2");

const config = require("../config/config.json");
try {
  var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    database: config.database,
    password: config.password,
  });
} catch (error) {
  console.log(error);
}

module.exports = pool.promise();
