import {SearchInput} from "../components/pages/ExpenseView/SearchInput";
import {msg} from "@lingui/macro";
import {useLingui} from "@lingui/react";
import {useMemo, useState, useContext, useRef} from "react";
import Expense from "../components/pages/ExpenseView/Expense";
import {orderBy} from "lodash";
import {ExpensesContext} from "../context";
import {useClickAway} from "react-use";

import {createPortal} from 'react-dom';
import classNames from "classnames";
import {X} from "@phosphor-icons/react";

export const Search = () => {
    const {_} = useLingui();
    const ref = useRef(null);
    const {expenses} = useContext(ExpensesContext);
    const [searchValue, setSearchValue] = useState("");
    const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false);

    const searchResults = useMemo(() => {
        if (searchValue === "" || searchValue.length < 3) {
            return [];
        }

        const filtered = expenses.filter((expense) => {
            return (
                expense.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                expense.note.toLowerCase().includes(searchValue.toLowerCase()) ||
                expense.amount.toString().includes(searchValue)
            );
        });

        if (filtered.length > 0) {
            setIsSearchResultsOpen(true);
        }

        return orderBy(filtered, ['timestamp'], "asc");
    }, [expenses, searchValue]);

    const searchResultsAmountSum = useMemo(() => {
        return searchResults.reduce((acc, expense) => {
            return acc + expense.amount;
        }, 0);
    }, [searchResults]);

    useClickAway(ref, () => {
        setIsSearchResultsOpen(false);
    });

    return (
        <>
            <SearchInput
                placeholder={_(msg`Search`)}
                value={searchValue}
                onFocus={() => setIsSearchResultsOpen(true)}
                onChange={setSearchValue}
            />
            {createPortal((
                <div
                    ref={ref}
                    className={classNames({
                        "hidden": !isSearchResultsOpen,
                        "flex flex-col items-center justify-center": true,
                        "fixed backdrop-brightness-50 w-screen h-screen z-40 top-0": true,
                    })}>
                    <div
                        onClick={() => setIsSearchResultsOpen(false)}
                        className="mb-4 rounded-full bg-black p-8">
                        <X size={32} color="white"/>
                    </div>
                    <div className="max-w-screen-xl bg-white shadow-2xl rounded-2xl p-4 flex flex-col gap-4">
                        <div>
                            <SearchInput
                                placeholder={_(msg`Search`)}
                                value={searchValue}
                                onFocus={() => setIsSearchResultsOpen(true)}
                                onChange={setSearchValue}
                            />
                            <span className="float-left font-bold text-lg">
                        {searchResultsAmountSum}₪
                        </span>
                        </div>
                        <div className="overflow-y-auto">
                            {searchResults.map((expense) => (
                                <Expense
                                    isListView
                                    key={expense.id}
                                    expense={expense}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ), document.getElementById("modal-root") || document.body)}
        </>
    )
}