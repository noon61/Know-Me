const mysql = require('mysql2/promise');

let connection;

async function initDb() {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'nodeuser',
    password: 'nodepass',
    database: 'Know-Me',
  });
  console.log('DB connected');
}

function getConnection() {
  if (!connection) throw new Error('DB connection is not initialized');
  return connection;
}

module.exports = { initDb, getConnection };
