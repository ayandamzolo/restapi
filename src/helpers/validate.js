const validateUser = (user) => {
  if (!user.username || !user.password) {
    return { valid: false, message: "Username and password are required." };
  }
  return { valid: true };
};

const validateExpense = (expense) => {
  if (!expense.user_id || !expense.amount || !expense.category) {
    return {
      valid: false,
      message: "User ID, amount, and category are required.",
    };
  }
  if (typeof expense.amount !== "number" || expense.amount <= 0) {
    return { valid: false, message: "Amount must be a positive number." };
  }
  return { valid: true };
};

module.exports = { validateUser, validateExpense };
