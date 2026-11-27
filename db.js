const mysql = require("mysql2/promise");
require("dotenv").config();

const host = `${process.env.DB_HOST_1}.${process.env.DB_HOST_2}`;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
const port = Number(process.env.DB_PORT || 3306);

const missingSettings = Object.entries({
  DB_HOST: host,
  DB_USER: user,
  DB_PASSWORD: password,
  DB_NAME: database
})
  .filter(([, value]) => value === undefined || value === null)
  .map(([name]) => name);

if (missingSettings.length > 0) {
  throw new Error(`Faltan variables de conexión MySQL: ${missingSettings.join(", ")}`);
}

const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  port,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
