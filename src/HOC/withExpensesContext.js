import { useContext } from "react";
import { ExpensesContext } from "../context";

export const withExpensesContext = (Component) => {
  return (props) => {
    const { expensesArray: expenses, setExpenses, deleteExpense, refetch } = useContext(ExpensesContext);
    return (
        <Component
            {...props}
            refetchExpenses={refetch}
            expenses={expenses}
            deleteExpense={deleteExpense}
            setExpenses={setExpenses}/>
    );
  };
};
