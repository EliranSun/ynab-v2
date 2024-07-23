import {useContext} from "react";
import {ExpensesContext} from "../context";

export const withExpensesContext = (Component) => {
    return (props) => {
        const {
            expenses,
            setExpenses,
            deleteExpense,
            refetch,
            markExpensesAsOriginal
        } = useContext(ExpensesContext);

        return (
            <Component
                {...props}
                markExpensesAsOriginal={markExpensesAsOriginal}
                refetchExpenses={refetch}
                expenses={expenses}
                deleteExpense={deleteExpense}
                setExpenses={setExpenses}/>
        );
    };
};
