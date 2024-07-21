import {ExpenseInputs} from "../../molecules/ExpenseInputs";
import {useContext, useState} from "react";
import {addExpense} from "../../../utils/db";
import {Expense} from "../../../models";
import {InputTypes} from "./constants";
import {v4 as uuid} from 'uuid';
import {formatDateObjectToInput} from "../../../utils/date";
import {noop} from "lodash";
import {ExpensesContext} from "../../../context";

export const AddExpenseEntry = ({
    expense: initExpense = {},
    isCategorySelectionVisible = true,
    readonly = false,
    onSuccess = noop,
    onRemove,
}) => {
    const {refetch} = useContext(ExpensesContext);
    const [expense, setExpense] = useState({
        id: uuid(),
        [InputTypes.NAME]: initExpense.name || "",
        [InputTypes.NOTE]: initExpense.note || "",
        [InputTypes.AMOUNT]: initExpense.amount || "",
        [InputTypes.DATE]: initExpense.date || formatDateObjectToInput(new Date()),
        [InputTypes.SUBCATEGORY_ID]: null,
    });

    return (
        <ExpenseInputs
            readonly={readonly}
            expense={expense}
            isVisible={isCategorySelectionVisible}
            onRemove={onRemove}
            onSave={async () => {
                if (
                    !expense[InputTypes.NAME] ||
                    !expense[InputTypes.AMOUNT] ||
                    !expense[InputTypes.SUBCATEGORY_ID] ||
                    !expense[InputTypes.DATE]
                ) {
                    alert(JSON.stringify(expense));
                    return;
                }

                const modeledExpense = new Expense(expense);
                await addExpense(modeledExpense);
                console.info("Success!", modeledExpense);
                onSuccess();
                return refetch();
            }}
            onInputChange={(type, value) => {
                setExpense((prev) => {
                    const newExpense = {...prev};
                    newExpense[type] = value;
                    return newExpense;
                });
            }}
        />
    )
};
