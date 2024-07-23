const queries = {
  createDatabase: `CREATE DATABASE expense_tracker;`,
  createUsersTable: `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );`,
  createExpensesTable: `CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        amount FLOAT NOT NULL,
        category VARCHAR(255) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
  getUserByUsername: `SELECT * FROM users WHERE username = $1`,
  insertExpense: `INSERT INTO expenses (user_id, amount, category) VALUES ($1, $2, $3) RETURNING *`,
  getAllExpenses: `SELECT * FROM expenses`,
  updateExpenseById: `UPDATE expenses SET amount = $1, category = $2 WHERE id = $3 RETURNING *`,
  deleteExpenseById: `DELETE FROM expenses WHERE id = $1`,
  getTotalExpenses: `SELECT SUM(amount) AS total FROM expenses`,
};

module.exports = { queries };
