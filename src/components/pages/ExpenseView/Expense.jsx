import {useContext, useState} from "react";
import {deleteExpense, updateExpense} from "../../../utils/db";
import {ExpensesContext} from "../../../context";
import {isEqual, noop} from "lodash";
import {ExpenseInputs} from "../../molecules/ExpenseInputs";

const Expense = ({
                     expense,
                     isIncome = false,
                     isListView: isVisible = false,
                     onHide = noop,
                 }) => {
    const {refetch} = useContext(ExpensesContext);
    const [newExpense, setNewExpense] = useState(expense);

    return (
        <ExpenseInputs
            expense={expense}
            isVisible={isVisible}
            isIncome={isIncome}
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
                await deleteExpense(expense.id);
                refetch();
            }}/>
    );
};

export default Expense;