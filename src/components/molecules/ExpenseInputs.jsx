import classNames from "classnames";
import {Check, EyeSlash, FloppyDisk, Spinner, Trash, X} from "@phosphor-icons/react";
import {noop} from "lodash";
import {msg} from "@lingui/macro";
import {useLingui} from "@lingui/react";
import {InputTypes} from "../pages/ParseExpensesList/constants";
import {ExpenseCategorySelection} from "../organisms/ExpenseCategorySelection";
import {Input, TextInput} from "../../features/CategoriesEdit/TextInput";
import {Button} from "../../features/CategoriesEdit/Button";
import {useState} from "react";
import {formatDateObjectToInput} from "../../utils/date";

const InputPlaceholder = {
    name: msg`name`,
    amount: msg`amount`,
    note: msg`note`,
};

const Months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const formatDateString = (date) => {
    // i.e. July 16, 24 to 2024-07-16
    try {
        const [monthName, day, year] = date.split(" ");
        const monthIndex = Months.indexOf(monthName);
        const fullYearNumber = Number(`20${year}`);
        const dayNumber = Number(day.replace(",", ""));

        const dateObject = new Date(fullYearNumber, monthIndex, dayNumber);
        return formatDateObjectToInput(dateObject);
    } catch (error) {
        return date;
    }
}
export const ExpenseInputs = ({
    readonly,
    isVisible,
    expense,
    onInputChange = noop,
    onRemove,
    onHide,
    onSave,
    isIncome = false,
    isSaveDisabled = false,
}) => {
    const {_} = useLingui();
    const [isLoading, setIsLoading] = useState(null);
    const [isSuccess, setIsSuccess] = useState(null);

    if (!isVisible || !expense) {
        return null;
    }

    return (
        <div className={classNames("text-right w-full", {
            "rounded-xl": true,
            "flex items-center": true,
            "bg-green-100": isIncome,
            "grayscale opacity-50": expense.isHidden,
        })}>
            <div className="w-72 shrink-0">
                <ExpenseCategorySelection
                    expense={expense}
                    readonly={readonly}
                    onCategorySelect={value => {
                        onInputChange(InputTypes.SUBCATEGORY_ID, value);
                    }}/>
            </div>
            <div className="w-32 shrink-0">
                <Input
                    type="date"
                    disabled={readonly}
                    defaultValue={
                        formatDateString(expense.date) ||
                        formatDateObjectToInput(new Date())}
                    onChange={(event) => {
                        onInputChange(InputTypes.DATE, event.target.value);
                    }}
                />
            </div>
            <div className="w-60 shrink-0">
                <TextInput
                    disabled={readonly}
                    defaultValue={expense.name}
                    placeholder={_(InputPlaceholder.name)}
                    onChange={(value) => {
                        onInputChange(InputTypes.NAME, value);
                    }}/>
            </div>
            <div className="w-28 shrink-0 flex items-center">
                ₪<Input
                type="number"
                disabled={readonly}
                defaultValue={expense.amount}
                placeholder={_(InputPlaceholder.amount)}
                onChange={(event) => {
                    onInputChange(InputTypes.AMOUNT, event.target.value);
                }}
            />
            </div>
            <div className="w-40 shrink-0">
                <TextInput
                    placeholder={_(InputPlaceholder.note)}
                    defaultValue={expense.note}
                    disabled={readonly}
                    onChange={(value) => {
                        onInputChange(InputTypes.NOTE, value);
                    }}/>
            </div>
            {onHide ?
                <Button
                    variation={Button.Variation.HIDE}
                    className=""
                    onClick={onHide}>
                    <EyeSlash/>
                </Button> : null}
            {onSave ?
                <Button
                    isDisabled={isSaveDisabled}
                    variation={Button.Variation.SAVE}
                    onClick={async () => {
                        setIsLoading(true);
                        try {
                            await onSave();
                            setIsSuccess(true);
                        } catch (e) {
                            console.error("Failed to save expense", e);
                            setIsSuccess(false);
                        } finally {
                            setTimeout(() => {
                                setIsLoading(false);
                            }, 300);
                        }
                    }}>
                    {isLoading === null ?
                        <FloppyDisk/> : isLoading ?
                            <Spinner className="animate-spin"/> : isSuccess ?
                                <Check/> : <X/>}
                </Button> : null}
            {onRemove ?
                <Button
                    onClick={async () => {
                        setIsLoading(true);
                        if (window.confirm(`Are you sure you want to remove ${expense.name}?`)) {
                            await onRemove();
                            setTimeout(() => {
                                setIsLoading(false);
                            }, 300);
                        }
                    }}
                    variation={Button.Variation.DELETE}>
                    <Trash/>
                </Button> : null}
        </div>
    );
};