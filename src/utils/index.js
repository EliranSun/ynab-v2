import { Categories, ThirdParties } from "../constants";

export const aggregateTransactionsByName = (
    transactions,
    isSameDate = null,
    shouldOverrideThirdPartyCheck = false
) => {
  const aggregatedTransactions = [];
  
  for (const transaction of transactions) {
    const { name, amount, timestamp } = transaction;
    
    if (isSameDate && !isSameDate(timestamp)) {
      continue;
    }
    
    if (!shouldOverrideThirdPartyCheck && ThirdParties.includes(name)) {
      aggregatedTransactions.push(transaction);
      continue;
    }
    
    const transactionIndex = aggregatedTransactions.findIndex(
        (aggregatedTransaction) => aggregatedTransaction.name === name
    );
    
    if (transactionIndex !== -1) {
      aggregatedTransactions[transactionIndex].amount += amount;
      aggregatedTransactions[transactionIndex].transactions = [
        ...(aggregatedTransactions[transactionIndex].transactions || []),
        transaction,
      ];
      continue;
    }
    
    aggregatedTransactions.push({
      ...transaction,
      transactions: [transaction],
    });
  }
  
  return aggregatedTransactions;
};

export const isExpenseInMonth = (expenseTimestamp, timestamp) => {
  const year = new Date(timestamp).getFullYear();
  const month = new Date(timestamp).getMonth();
  const expenseMonth = new Date(expenseTimestamp).getMonth();
  const expenseYear = new Date(expenseTimestamp).getFullYear();
  
  return expenseMonth === month && expenseYear === year;
};

export const getExpenseCategoryName = (categoryId) => {
  let subcategoryName = "";
  let subcategoryId = null;
  
  const category = Categories.find((category) => {
    const subcategory = category.subCategories.filter(
        (subcategory) => String(subcategory.id) === String(categoryId)
    )[0];
    
    if (subcategory) {
      subcategoryName = subcategory.name;
      subcategoryId = subcategory.id;
      return true;
    }
    
    return false;
  });
  
  return {
    ...category,
    subcategoryName,
    subcategoryId,
  };
};

export * from "./localStorage";
export * from "./firebase";
export * from './currency';