const findExpense = (expenses, id) => {
  return expenses.find((exp) => exp.id === +id);
};

const filterExpense = (expenses, id) => {
  // eslint-disable-next-line no-param-reassign
  expenses = expenses.filter((exp) => exp.id !== +id);

  return expenses;
};

module.exports = {
  findExpense,
  filterExpense,
};
