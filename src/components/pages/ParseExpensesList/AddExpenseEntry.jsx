import {ExpenseInputs} from "../../molecules/ExpenseInputs";
import {useState} from "react";
import {Trans} from "@lingui/macro";
import {addExpense} from "../../../utils/db";
import {Expense} from "../../../models";
import {InputTypes} from "./constants";
import {v4 as uuid} from 'uuid';

export const AddExpenseEntry = ({
                                    id = null,
                                    expenses = [],
                                    isCategorySelectionVisible = true,
                                    readonly = false,
                                }) => {
    const [expense, setExpense] = useState({
        id: uuid(),
        [InputTypes.NAME]: "",
        [InputTypes.NOTE]: "",
        [InputTypes.AMOUNT]: 0,
        [InputTypes.DATE]: new Date(),
        [InputTypes.SUBCATEGORY_ID]: null,
    });

    return (
        <div className="snap-start w-full flex flex-col gap-4">
            <ExpenseInputs
                readonly={readonly}
                expense={expense}
                isVisible={isCategorySelectionVisible}
                onInputChange={(type, value) => {
                    setExpense((prev) => {
                        const newExpense = {...prev};
                        newExpense[type] = value;
                        return newExpense;
                    });
                }}
            />
            <button
                className="p-4 bg-blue-500 text-white cursor-pointer rounded-xl shadow-xl"
                onClick={async () => {
                    if (
                        !expense.name ||
                        !expense.amount ||
                        !expense.subcategoryId
                    ) {
                        alert(JSON.stringify(expense));
                        return;
                    }

                    const modeledExpense = new Expense(expense);
                    await addExpense(modeledExpense);
                    console.info("Success!", modeledExpense);
                }}>
                <Trans>Add Expense</Trans>
            </button>
        </div>
    )
};
