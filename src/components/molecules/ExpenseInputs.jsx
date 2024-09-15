import classNames from "classnames";
import { Check, EyeSlash, FloppyDisk, Spinner, Trash, X } from "@phosphor-icons/react";
import { noop } from "lodash";
import { msg, Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { InputTypes } from "../pages/ParseExpensesList/constants";
import { ExpenseCategorySelection } from "../organisms/ExpenseCategorySelection";
import { Input, TextInput } from "../../features/CategoriesEdit/TextInput";
import { Button } from "../../features/CategoriesEdit/Button";
import { useState } from "react";
import { formatDateObjectToInput } from "../../utils/date";
import { GuageBar } from "../atoms/GuageBar";

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
    isListView,
    expense,
    onInputChange = noop,
    onRemove,
    onHide,
    onSave,
    isIncome = false,
    isSaveDisabled = false,
    isVertical = false,
    isLean = false,
    budget = 0,
}) => {
    const { _ } = useLingui();
    const [isLoading, setIsLoading] = useState(null);
    const [isSuccess, setIsSuccess] = useState(null);
    const [recurCount, setRecurCount] = useState(1);

    if (!expense) {
        return null;
    }

    return (
        <div className={classNames("text-right w-full", {
            "rounded-xl": false,
            "flex justify-between text-sm items-start": true,
            "flex-col gap-8": isVertical,
            "flex-row gap-2": !isVertical,
            "text-green-500": isIncome,
            "grayscale opacity-50": expense.isHidden,
            " py-1": isLean, // border-b last-of-type:border-none
        })}>
            <div className="flex gap-2">
                <div className="hidden md:block">
                    {onHide ?
                        <Button
                            variation={Button.Variation.HIDE}
                            className=""
                            onClick={onHide}>
                            <EyeSlash />
                        </Button> : null}
                </div>
                {isLean ? null :
                    <div className="w-60 shrink-0">
                        <ExpenseCategorySelection
                            expense={expense}
                            isLean={isLean}
                            readonly={readonly}
                            onCategorySelect={value => {
                                onInputChange(InputTypes.SUBCATEGORY_ID, value);
                            }} />
                    </div>}
                <div className="max-w-32 shrink-0">
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
                <div className="w-full flex flex-col">
                    <TextInput
                        disabled={readonly}
                        isLean={isLean}
                        defaultValue={expense.name}
                        placeholder={_(InputPlaceholder.name)}
                        onChange={(value) => {
                            onInputChange(InputTypes.NAME, value);
                        }} />
                    <TextInput
                        isLean={isLean}
                        placeholder={_(InputPlaceholder.note)}
                        defaultValue={expense.note}
                        disabled={readonly}
                        isSecondary
                        onChange={(value) => {
                            onInputChange(InputTypes.NOTE, value);
                        }} />
                </div>
                <div className="w-full relative flex flex-col items-start gap-0">
                    <span className="flex">
                        ₪<Input
                            type="number"
                            disabled={readonly}
                            defaultValue={isLean ? Math.round(expense.amount) : expense.amount}
                            placeholder={_(InputPlaceholder.amount)}
                            onChange={(event) => {
                                onInputChange(InputTypes.AMOUNT, event.target.value);
                            }}
                        />
                    </span>
                    <GuageBar amount={expense.amount} max={budget} width={90} />
                </div>
                {isListView ? null :
                    <div className="flex items-center gap-2">
                        <label><Trans>Recurring Transaction Count</Trans></label>
                        <Input
                            type="number"
                            className="w-16"
                            disabled={readonly}
                            value={recurCount}
                            onChange={(event) => {
                                setRecurCount(Number(event.target.value));
                            }} />
                    </div>}
            </div>
            <div className="hidden md:flex items-center">
                {onSave ?
                    <Button
                        isDisabled={isSaveDisabled}
                        variation={Button.Variation.SAVE}
                        onClick={async () => {
                            setIsLoading(true);
                            try {
                                await onSave(recurCount);
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
                            <FloppyDisk /> : isLoading ?
                                <Spinner className="animate-spin" /> : isSuccess ?
                                    <Check /> : <X />}
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
                        {isLoading === null ?
                            <Trash /> : isLoading ?
                                <Spinner className="animate-spin" /> : isSuccess ?
                                    <Check /> : <X />}
                    </Button> : null}
            </div>
        </div>
    );
};