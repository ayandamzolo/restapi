const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../models/configuration/config");
const { validateUser, validateExpense } = require("../helpers/validate");
const { queries } = require("../helpers/helper_objects");

const createDatabaseAndTables = async () => {
  await pool.query(queries.createUsersTable);
  await pool.query(queries.createExpensesTable);
};

createDatabaseAndTables();

// User authentication API endpoint
router.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const { valid, message } = validateUser({ username, password });

  if (!valid) {
    return res.status(400).json({ message });
  }

  try {
    const result = await pool.query(queries.getUserByUsername, [username]);
    const user = result.rows[0];

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ message: "Login successful", token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Expense management API endpoints

router.get("/api/expenses", async (_req, res) => {
  try {
    const result = await pool.query(queries.getAllExpenses);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

router.post("/api/expenses", async (req, res) => {
  const expense = req.body;
  const { valid, message } = validateExpense(expense);

  if (!valid) {
    return res.status(400).json({ message });
  }

  try {
    const result = await pool.query(queries.insertExpense, [
      expense.user_id,
      expense.amount,
      expense.category,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

router.put("/api/expenses/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { amount, category } = req.body;
  const { valid, message } = validateExpense({ user_id: 1, amount, category }); // user_id is not needed for update validation

  if (!valid) {
    return res.status(400).json({ message });
  }

  try {
    const result = await pool.query(queries.updateExpenseById, [
      amount,
      category,
      id,
    ]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

router.delete("/api/expenses/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await pool.query(queries.deleteExpenseById, [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Expense calculation API endpoint

router.get("/api/expenses/total", async (_req, res) => {
  try {
    const result = await pool.query(queries.getTotalExpenses);
    res.json({ total: result.rows[0].total });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// Serve Pug templates

router.get("/expenses", async (_req, res) => {
  try {
    const result = await pool.query(queries.getAllExpenses);
    res.render("expenses", { expenses: result.rows });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

router.get("/expenses/total", async (_req, res) => {
  try {
    const result = await pool.query(queries.getTotalExpenses);
    res.render("total", { total: result.rows[0].total });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

module.exports = router;
