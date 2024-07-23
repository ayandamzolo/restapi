require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "user",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "db",
  password: process.env.DB_PASSWORD || "pass",
  port: process.env.DB_PORT || 5432,
});

module.exports = { pool };