import { Expense } from "../models";

export const isExistingExpense = (newExpense, expenses) => {
  return expenses.find((expense) => {
    return (
        expense.name === newExpense.name &&
        expense.timestamp === newExpense.timestamp &&
        newExpense.amount === expense.amount
    );
  });
};

export const getExistingExpenses = (expense, expenses) => {
  return expenses.filter((item) => {
    return (
        expense.name === item.name &&
        expense.timestamp === item.timestamp &&
        expense.amount === item.amount
    );
  });
};

export const parseNewExpenses = (text = '', existingExpenses = []) => {
  const rows = text.split("\n");
  return rows.map((row) => {
    const cells = row.split("\t");
    const name = cells[0];
    const amount = cells[4];
    const dateParts = cells[1]?.split("/");
    const year = dateParts && `20${dateParts[2]}`;
    const month = dateParts && Number(dateParts[1]) - 1;
    const day = dateParts && dateParts[0];
    const timestamp = new Date(Date.UTC(year, month, day)).getTime();
    const parsedAmount =
        amount &&
        parseFloat(amount.replace(",", "").replace("₪", "").trim());
    
    if (!name || !parsedAmount || !timestamp) {
      return {};
    }
    
    return new Expense({
      name: name,
      timestamp: timestamp,
      amount: parsedAmount,
      note: cells[5],
    });
  })
      .filter((row) => {
        if (isExistingExpense(row, existingExpenses)) {
          return false;
        }
        
        return row.name && row.amount && row.timestamp;
      });
};