import classNames from "classnames";
import {Spinner, Check, EyeSlash, FloppyDisk, X, Trash} from "@phosphor-icons/react";
import {noop} from "lodash";
import {msg} from "@lingui/macro";
import {useLingui} from "@lingui/react";
import {InputTypes} from "../pages/ParseExpensesList/constants";
import {ExpenseCategorySelection} from "../organisms/ExpenseCategorySelection";
import {Input, TextInput} from "../../features/CategoriesEdit/TextInput";
import {Button} from "../../features/CategoriesEdit/Button";
import {useState} from "react";

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
                                  onHide = noop,
                                  onSave = noop,
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
        })}>
            <div className="w-60 shrink-0">
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
                    defaultValue={formatDate(new Date(expense.timestamp)) || formatDate(new Date())}
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
            <div className="w-28 shrink-0">
                <Input
                    type="number"
                    disabled={readonly}
                    defaultValue={expense.amount}
                    placeholder={_(InputPlaceholder.amount)}
                    onChange={(event) => {
                        onInputChange(InputTypes.AMOUNT, event.target.value);
                    }}
                />
            </div>
            <TextInput
                placeholder={_(InputPlaceholder.note)}
                defaultValue={expense.note}
                disabled={readonly}
                onChange={(value) => {
                    onInputChange(InputTypes.NOTE, value);
                }}/>
            <Button
                variation={Button.Variation.HIDE}
                className=""
                onClick={onHide}>
                <EyeSlash/>
            </Button>
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
                        }, 1500);
                    }
                }}>
                {isLoading === null ?
                    <FloppyDisk/> : isLoading ?
                        <Spinner className="animate-spin"/> : isSuccess ?
                            <Check/> : <X/>}
            </Button>
            <Button
                onClick={onRemove}
                variation={Button.Variation.DELETE}>
                <Trash/>
            </Button>

        </div>
    );
};