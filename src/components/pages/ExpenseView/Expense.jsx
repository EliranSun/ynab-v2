import {useContext, useState} from "react";
import {deleteExpense, updateExpense} from "../../../utils/db";
import {ExpensesContext} from "../../../context";
import {isEqual, noop} from "lodash";
import {ExpenseInputs} from "../../molecules/ExpenseInputs";

const Expense = ({
                     expense,
                     isListView: isVisible = false,
                     onHide = noop,
                 }) => {
    const {refetch} = useContext(ExpensesContext);
    const [newExpense, setNewExpense] = useState(expense);

    return (
        <ExpenseInputs
            expense={expense}
            isVisible={isVisible}
            isSaveDisabled={isEqual(newExpense, expense)}
            onHide={onHide}
            onSave={async () => {
                await updateExpense(newExpense);
                return refetch();
            }}
            onInputChange={(type, value) => {
                setNewExpense((prev) => {
                    const newExpense = {...prev};
                    newExpense[type] = value;
                    return newExpense;
                });
            }}
            onRemove={async () => {
                if (window.confirm(`Are you sure you want to delete ${expense.name}?`)) {
                    await deleteExpense(expense.id);
                    refetch();
                }
            }}/>
    );
};

export default Expense;