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
import {formatDate} from "../../utils/date";

const InputPlaceholder = {
    name: msg`name`,
    amount: msg`amount`,
    note: msg`note`,
};

export const ExpenseInputs = ({
                                  readonly,
                                  isVisible,
                                  expense,
                                  onInputChange = noop,
                                  onRemove = noop,
                                  onHide = noop,
                                  onSave = noop,
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