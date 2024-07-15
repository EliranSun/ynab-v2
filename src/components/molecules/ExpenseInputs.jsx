import classNames from "classnames";
import {CaretDown, EyeSlash, FloppyDisk, Trash} from "@phosphor-icons/react";
import {noop} from "lodash";
import {msg} from "@lingui/macro";
import {useLingui} from "@lingui/react";
import {InputTypes} from "../pages/ParseExpensesList/constants";
import {ExpenseCategorySelection} from "../organisms/ExpenseCategorySelection";
import {Input, TextInput} from "../../features/CategoriesEdit/TextInput";
import {Button} from "../../features/CategoriesEdit/Button";

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
                                  isSaveDisabled = false,
                              }) => {
    const {_} = useLingui();

    if (!isVisible || !expense) {
        return null;
    }

    console.log({isSaveDisabled});

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
                    defaultValue={formatDate(new Date())}
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
                    onChange={(event) => {
                        onInputChange(InputTypes.NAME, event.target.value);
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
                onChange={(event) => {
                    onInputChange(InputTypes.NOTE, event.target.value);
                }}/>
            <Button
                variation={Button.Variation.HIDE}
                className=""
                onClick={onHide}>
                <EyeSlash/>
            </Button>
            <Button
                isDisabled={isSaveDisabled}
                variation={Button.Variation.SAVE}>
                <FloppyDisk/>
            </Button>
            <Button
                onClick={onRemove}
                variation={Button.Variation.DELETE}>
                <Trash/>
            </Button>

        </div>
    );
};