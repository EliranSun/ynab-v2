import classNames from "classnames";
import {CaretDown, Trash, X} from "@phosphor-icons/react";
import {noop} from "lodash";
import {msg} from "@lingui/macro";
import {useLingui} from "@lingui/react";
import {InputTypes} from "../pages/ParseExpensesList/constants";

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
                                  index,
                                  name,
                                  note,
                                  amount,
                                  readonly,
                                  date,
                                  timestamp,
                                  isVisible,
                                  // setExpenses = noop,
                                  subcategoryLabel,
                                  onCategoryMenuClick = noop,
                                  isCategoryMenuOpen,
                                  onInputChange = noop,
                                  onRemove = noop,
                              }) => {
    const {_} = useLingui();
    console.log({amount, name});

    return (
        <div className={classNames("text-right w-full", {
            "rounded-xl p-4 md:p-2": true,
            "flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4": true,
            "bg-gray-200 border-gray-500": index % 2 === 0 || isVisible,
        })}>
            <input
                type="date"
                disabled={readonly}
                className="p-4 border border-gray-300 rounded w-1/6"
                // date="June 30, 24"
                // defaultValue="2021-06-30"
                defaultValue={formatDate(new Date())}
                onChange={(event) => {
                    onInputChange(InputTypes.DATE, event.target.value);
                }}
            />
            <input
                type="text"
                disabled={readonly}
                defaultValue={name}
                placeholder={_(InputPlaceholder.name)}
                className="p-4 border border-gray-300 rounded w-1/6"
                onChange={(event) => {
                    onInputChange(InputTypes.NAME, event.target.value);
                }}/>
            <input
                type="number"
                disabled={readonly}
                defaultValue={amount}
                placeholder={_(InputPlaceholder.amount)}
                className="p-4 border border-gray-300 rounded w-1/6"
                onChange={(event) => {
                    onInputChange(InputTypes.AMOUNT, event.target.value);
                }}
            />
            <button
                className={classNames({
                    "border border-gray-300 bg-white text-black": !isCategoryMenuOpen,
                    "hover:bg-black hover:text-white": true,
                    "p-4 font-mono flex items-center justify-between": true,
                    "cursor-pointer rounded w-1/6": true,
                })}
                onClick={() => {
                    if (readonly) {
                        return;
                    }

                    onCategoryMenuClick();
                    // setExpenses((prev) => {
                    //     const newExpenses = [...prev];
                    //     newExpenses[index].categoryId = null;
                    //     return newExpenses;
                    // });
                }}>
                <span>{subcategoryLabel}</span>
                <CaretDown/>
            </button>
            <input
                type="text"
                placeholder={_(InputPlaceholder.note)}
                defaultValue={note}
                disabled={readonly}
                className="border border-gray-300 w-1/6 rounded p-4 h-20 md:h-auto"
                onChange={(event) => {
                    onInputChange(InputTypes.NOTE, event.target.value);
                    // setExpenses((prev) => {
                    //     const newExpenses = [...prev];
                    //     newExpenses[index].note = event.target.value;
                    //     return newExpenses;
                    // });
                }}/>
            <span className="cursor-pointer" onClick={onRemove}>
                <Trash color="red" size={42}/>
            </span>
        </div>
    );
};