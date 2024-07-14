import classNames from "classnames";
import {CaretDown, Trash} from "@phosphor-icons/react";
import {noop} from "lodash";
import {msg} from "@lingui/macro";
import {useLingui} from "@lingui/react";
import {InputTypes} from "../pages/ParseExpensesList/constants";
import {useMemo, useContext, useState} from "react";
import {CategoriesContext} from "../../context/CategoriesContext";
import {ExpenseCategorySelection} from "../organisms/ExpenseCategorySelection";
import {Input, TextInput} from "../../features/CategoriesEdit/TextInput";

const InputPlaceholder = {
    name: msg`name`,
    amount: msg`amount`,
    note: msg`note`,
};

function formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero based
    let year = date.getFullYear();

    // Add leading zeros to day and month if needed
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;

    return `${year}-${month}-${day}`;
}

export const ExpenseInputs = ({
                                  readonly,
                                  isVisible,
                                  expense,
                                  onInputChange = noop,
                                  onRemove = noop,
                              }) => {
    const {_} = useLingui();

    if (!isVisible || !expense) {
        return null;
    }

    console.log({expense});

    return (
        <div className={classNames("text-right w-full", {
            "rounded-xl p-4 md:p-2": true,
            "flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4": true,
        })}>
            <Input
                type="date"
                disabled={readonly}
                defaultValue={formatDate(new Date())}
                onChange={(event) => {
                    onInputChange(InputTypes.DATE, event.target.value);
                }}
            />
            <TextInput
                disabled={readonly}
                defaultValue={expense.name}
                placeholder={_(InputPlaceholder.name)}
                onChange={(event) => {
                    onInputChange(InputTypes.NAME, event.target.value);
                }}/>
            <Input
                type="number"
                disabled={readonly}
                defaultValue={expense.amount}
                placeholder={_(InputPlaceholder.amount)}
                onChange={(event) => {
                    onInputChange(InputTypes.AMOUNT, event.target.value);
                }}
            />
            <ExpenseCategorySelection
                expense={expense}
                readonly={readonly}
                onCategorySelect={value => {
                    onInputChange(InputTypes.SUBCATEGORY_ID, value);
                }}/>
            <TextInput
                placeholder={_(InputPlaceholder.note)}
                defaultValue={expense.note}
                disabled={readonly}
                onChange={(event) => {
                    onInputChange(InputTypes.NOTE, event.target.value);
                }}/>
            <span className="cursor-pointer" onClick={onRemove}>
                <Trash color="red" size={42}/>
            </span>
        </div>
    );
};