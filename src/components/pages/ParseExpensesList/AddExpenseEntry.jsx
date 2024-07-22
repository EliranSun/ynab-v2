import {ExpenseInputs} from "../../molecules/ExpenseInputs";
import {useContext, useState} from "react";
import {addExpense, addExpenses} from "../../../utils/db";
import {Expense} from "../../../utils/db";
import {InputTypes} from "./constants";
import {v4 as uuid} from 'uuid';
import {formatDateObjectToInput} from "../../../utils/date";
import {noop} from "lodash";
import {addMonths} from "date-fns";
import {ExpensesContext} from "../../../context";

export const AddExpenseEntry = ({
    expense: initExpense = {},
    isCategorySelectionVisible = true,
    readonly = false,
    onSuccess = noop,
    onRemove,
    isVertical = false,
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
            isVertical={isVertical}
            onSave={async (recurCount = 1) => {
                if (
                    !expense[InputTypes.NAME] ||
                    !expense[InputTypes.AMOUNT] ||
                    !expense[InputTypes.SUBCATEGORY_ID] ||
                    !expense[InputTypes.DATE]
                ) {
                    alert(JSON.stringify(expense));
                    return;
                }

                if (recurCount > 1) {
                    const expenses = new Array(Number(recurCount))
                        .fill(expense)
                        .map((item, index) => {
                            return new Expense({
                                ...item,
                                date: addMonths(new Date(expense.date), index),
                                note: `${item.note} - ${index + 1}/${recurCount}`,
                            });
                        });

                    await addExpenses(expenses);
                    console.info("Success!", expenses);
                } else {
                    const modeledExpense = new Expense(expense);
                    await addExpense(modeledExpense);
                    console.info("Success!", modeledExpense);
                }

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
