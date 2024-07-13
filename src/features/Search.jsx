import {SearchInput} from "../components/pages/ExpenseView/SearchInput";
import {msg} from "@lingui/macro";
import {useLingui} from "@lingui/react";
import {useMemo, useState, useContext, useRef} from "react";
import Expense from "../components/pages/ExpenseView/Expense";
import {orderBy} from "lodash";
import {ExpensesContext} from "../context";
import {useClickAway} from "react-use";

export const Search = () => {
    const {_} = useLingui();
    const ref = useRef(null);
    const {expenses} = useContext(ExpensesContext);
    const [searchValue, setSearchValue] = useState("");
    const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false);

    const searchResults = useMemo(() => {
        if (searchValue === "") {
            setIsSearchResultsOpen(false);
            return [];
        }

        const filtered = expenses.filter((expense) => {
            return (
                expense.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                expense.note.toLowerCase().includes(searchValue.toLowerCase()) ||
                expense.amount.toString().includes(searchValue)
            );
        });

        setIsSearchResultsOpen(filtered.length > 0);

        return orderBy(filtered, ['timestamp'], "asc");
    }, [expenses, searchValue]);

    useClickAway(ref, () => {
        setIsSearchResultsOpen(false);
    });

    return (
        <>
            <SearchInput
                placeholder={_(msg`Search`)}
                onChange={setSearchValue}
            />
            {isSearchResultsOpen ?
                <div
                    ref={ref}
                    className="fixed backdrop-blur-lg w-screen h-screen top-0 flex items-center justify-center">
                    <div className="w-1/2 bg-white rounded-2xl p-4">
                        {searchResults.map((expense) => (
                            <Expense
                                isListView
                                key={expense.id}
                                expense={expense}
                            />
                        ))}
                    </div>
                </div> : null}
        </>
    )
}