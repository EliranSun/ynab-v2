import { useContext } from "react";
import { ExpensesContext } from "../context";

export const withExpensesContext = (Component) => {
  return (props) => {
      const { expensesArray: expenses, setExpenses } = useContext(ExpensesContext);
      return <Component {...props} expenses={expenses} setExpenses={setExpenses}/>;
  };
};
