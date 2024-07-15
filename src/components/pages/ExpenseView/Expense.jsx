import {useContext, useEffect, useState} from "react";
import {deleteExpense} from "../../../utils/db";
import {ExpensesContext} from "../../../context";
import {ExpenseInputs} from "../../molecules/ExpenseInputs";
import {v4 as uuid} from "uuid";
import {InputTypes} from "../ParseExpensesList/constants";
import {isEqual, noop} from "lodash";

const Expense = ({
                     expense,
                     isListView = false,
                     onHide = noop,
                 }) => {
    const [isUpdated, setIsUpdated] = useState(false);
    const {refetch} = useContext(ExpensesContext);
    // const category = useMemo(() => getExpenseCategoryName(expense.categoryId), [expense]);

    const [newExpense, setNewExpense] = useState(expense);

    useEffect(() => {
        if (isUpdated) {
            setTimeout(() => {
                setIsUpdated(false);
            }, 3000);
        }
    }, [isUpdated]);

    return (
        <ExpenseInputs
            expense={expense}
            isVisible={isListView}
            // subcategoryLabel={category.subcategoryName}
            isSaveDisabled={isEqual(newExpense, expense)}
            onHide={onHide}
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
                    setIsUpdated(true);
                    refetch();
                }
            }}/>
    );
};

export default Expense;