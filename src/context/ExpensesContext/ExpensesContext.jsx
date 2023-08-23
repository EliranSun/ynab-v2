import { createContext, useEffect, useMemo, useState } from "react";
import { noop } from "lodash";
import { addExpenses, deleteExpense, getExpenses, markExpensesAsOriginal, updateExpense } from "../../utils";
import { Categories } from "../../constants";

export const ExpensesContext = createContext({
  expenses: {},
  changeExpenseCategoryByName: noop,
});

export const ExpensesContextProvider = ({ children }) => {
  const [expenses, setExpenses] = useState({});
  const [categories, setCategories] = useState({});
  const [categoriesByAmount, setCategoriesByAmount] = useState([]);
  
  const expensesArray = useMemo(() => {
    return Object.values(expenses);
  }, [expenses]);
  
  const expensesPerMonthPerCategory = useMemo(() => {
    const expensesPerMonthPerCategory = {};
    expensesArray.forEach((expense) => {
      const { categoryId } = expense;
      // TODO: util
      const dateKey = new Date(expense.timestamp).toLocaleString("en-IL", {
        // day: "numeric",
        month: "short",
        year: "2-digit",
      });
      
      if (!expensesPerMonthPerCategory[categoryId]) {
        expensesPerMonthPerCategory[categoryId] = {
          [dateKey]: {
            amount: expense.amount,
            expenses: [expense],
            timestamp: expense.timestamp,
          },
        };
      } else if (!expensesPerMonthPerCategory[categoryId][dateKey]) {
        expensesPerMonthPerCategory[categoryId][dateKey] = {
          amount: expense.amount,
          expenses: [expense],
          timestamp: expense.timestamp,
        };
      } else {
        expensesPerMonthPerCategory[categoryId][dateKey] = {
          amount: expensesPerMonthPerCategory[categoryId][dateKey].amount + expense.amount,
          expenses: [...expensesPerMonthPerCategory[categoryId][dateKey].expenses, expense],
          timestamp: expense.timestamp,
        };
      }
    });
    
    return expensesPerMonthPerCategory;
  }, [expensesArray]);
  
  useEffect(() => {
    (async () => {
      const expenses = await getExpenses();
      setExpenses(expenses);
      
      const newCategories = {};
      Object.values(expenses).forEach(expense => {
        if (!newCategories[expense.mainCategoryId]) {
          const category = Categories.find(category => category.id === expense.mainCategoryId);
          const subcategory = category?.subCategories.find(subcategory => subcategory.id === expense.subcategoryId);
          
          newCategories[expense.mainCategoryId] = {
            ...category,
            amount: expense.amount,
            subcategories: {
              [expense.subcategoryId]: {
                ...subcategory,
                amount: expense.amount,
              }
            }
          };
          
          delete newCategories[expense.mainCategoryId].subCategories;
        } else if (!newCategories[expense.mainCategoryId].subcategories[expense.subcategoryId]) {
          const subcategory = Categories
            .find(category => category.id === expense.mainCategoryId)?.subCategories
            .find(subcategory => subcategory.id === expense.subcategoryId);
          
          newCategories[expense.mainCategoryId].subcategories[expense.subcategoryId] = {
            name: subcategory?.name,
            amount: expense.amount,
          }
        } else {
          newCategories[expense.mainCategoryId].subcategories[expense.subcategoryId].amount += expense.amount;
          // newCategories[expense.mainCategoryId].subcategories.amount += expense.amount;
          newCategories[expense.mainCategoryId].amount += expense.amount;
        }
      });
      
      console.log({ newCategories });
      setCategories(newCategories);
      setCategoriesByAmount(Object.values(newCategories).sort((a, b) => b.amount - a.amount));
    })();
  }, []);
  
  const setExpenseAsRecurring = (expenseId, isRecurring) => {
    updateExpense(expenseId, { isRecurring });
    setExpenses({
      ...expenses,
      [expenseId]: {
        ...expenses[expenseId],
        isRecurring,
      },
    });
  };
  
  const setExpenseAsIncome = (expenseId, isIncome) => {
    updateExpense(expenseId, { isIncome });
    setExpenses({
      ...expenses,
      [expenseId]: {
        ...expenses[expenseId],
        isIncome,
      },
    });
  };
  
  const setExpenseNote = async (expenseId, note) => {
    if (note === expenses[expenseId].note) {
      return;
    }
    
    await updateExpense(expenseId, { note });
    
    setExpenses({
      ...expenses,
      [expenseId]: {
        ...expenses[expenseId],
        note,
      },
    });
  };
  
  const changeExpenseCategory = async (expenseId, categoryId, note = "") => {
    const expense = expenses[expenseId];
    const allExpensesWithTheSameName = expensesArray.filter(
      ({ name }) => name === expense.name
    );
    if (!expense.isThirdParty) {
      allExpensesWithTheSameName.forEach((expense) => {
        updateExpense(expense.id, { categoryId, note });
        setExpenses({
          ...expenses,
          [expense.id]: {
            ...expenses[expense.id],
            categoryId,
          },
        });
      });
      
      return;
    }
    
    await updateExpense(expenseId, { categoryId, note });
    setExpenses({
      ...expenses,
      [expenseId]: {
        ...expenses[expenseId],
        categoryId,
      },
    });
  };
  
  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        expensesPerMonthPerCategory,
        categories,
        categoriesByAmount,
        setExpenseAsRecurring,
        setExpenseAsIncome,
        changeExpenseCategory,
        deleteExpense,
        setExpenseNote,
        expensesArray,
        markExpensesAsOriginal,
        setExpenses: async (newExpenses = []) => {
          const expensesObject = {};
          newExpenses.forEach((expense) => {
            expensesObject[expense.id] = expense;
          });
          
          try {
            await addExpenses(newExpenses);
            setExpenses(expensesObject);
          } catch (error) {
            alert(`Error adding expenses - ${error.message}`);
          }
        },
        refetch: async () => {
          const expenses = await getExpenses();
          setExpenses(expenses);
        },
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};
