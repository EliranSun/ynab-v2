import { useContext, useMemo, useState } from "react";
import { noop, orderBy } from "lodash";
import { ExpensesContext } from "../../context";
import Expense from "./Expense";
import { isExpenseInMonth } from "../../utils";
import TopExpensesView from "./TopExpensesView";
import { useDate } from "../DateChanger/DateChanger";
import { Button } from "../atoms";
import { SearchInput } from "./SearchInput";
import { BoxAmount } from "./BoxAmount";
import { SortBy } from "./constants";

const ExpenseView = ({ onCategoryClick = noop }) => {
    const {
        expensesArray: expenses = [],
        setExpenseAsRecurring,
        setExpenseAsIncome,
        setExpenseNote,
        refetch
    } = useContext(ExpensesContext);
    
    const [searchValue, setSearchValue] = useState("");
    const [sort, setSort] = useState(SortBy.DATE);
    const [isSearchingAll, setIsSearchingAll] = useState(false);
    const {
        isSameDate,
        currentTimestamp,
        toDate,
        formattedDate,
        NextButton,
        PreviousButton
    } = useDate();
    
    const thisMonthExpenses = useMemo(() => {
        const thisMonth = expenses.filter((expense) => {
            return isExpenseInMonth(expense.timestamp, currentTimestamp);
        });
        
        return orderBy(thisMonth, sort, "desc");
    }, [expenses, currentTimestamp, sort]);
    
    console.log({ thisMonthExpenses })
    
    const filteredExpenses = useMemo(() => {
        if (searchValue === "") {
            return isSearchingAll ? [] : thisMonthExpenses;
        }
        
        const filtered = (isSearchingAll ? expenses : thisMonthExpenses).filter((expense) => {
            return expense.name
                .toLowerCase()
                .includes(searchValue.toLowerCase());
        });
        
        return orderBy(filtered, ['timestamp'], "asc");
    }, [searchValue, thisMonthExpenses, isSearchingAll]);
    
    return (
        <div className="pb-96">
            <h1 className="text-3xl my-4">Track (Expense View)</h1>
            <h2>Sort by</h2>
            <div className="flex gap-4">
                <Button onClick={() => setSort(SortBy.DATE)}>Date</Button>
                <Button onClick={() => setSort(SortBy.AMOUNT)}>Amount</Button>
                <Button onClick={() => setSort(SortBy.CATEGORY)}>Category</Button>
                <Button onClick={() => setSort(SortBy.NAME)}>Name</Button>
            </div>
            <div className="fixed bottom-10 right-20 bg-white shadow-xl p-2">
                <PreviousButton/>
                <NextButton/>
            </div>
            <div className="p-4">
                <SearchInput
                    placeholder={
                        isSearchingAll
                            ? `Search through ${expenses.length} expenses`
                            : `Search through ${filteredExpenses.length} expenses in ${formattedDate}`
                    }
                    onChange={setSearchValue}
                />
                <span>
                    <input
                        type="checkbox"
                        id="searchAll"
                        className="mr-2"
                        onClick={() => setIsSearchingAll(!isSearchingAll)}
                    />
                    <label htmlFor="searchAll">Search all expenses?</label>
                </span>
                <div className="flex flex-col h-96 overflow-auto mt-4">
                    {filteredExpenses.map((expense) => (
                        <Expense
                            isListView
                            key={expense.id}
                            expense={expense}
                            onIsRecurringChange={setExpenseAsRecurring}
                            onIsIncomeChange={setExpenseAsIncome}
                            onCategoryClick={onCategoryClick}
                            onNoteChange={setExpenseNote}
                            onDelete={refetch}
                        />
                    ))}
                </div>
            </div>
            <TopExpensesView
                date={formattedDate}
                expenses={expenses}
                isSameDate={isSameDate}
                toDate={toDate}
            />
            <div>
                <h2 className="text-2xl my-4 bg-gray-200">Stats for {formattedDate}</h2>
                <h3>Sums</h3>
                <div className="flex gap-4">
                    <BoxAmount expenses={thisMonthExpenses} min={-1} max={-1}/>
                    <BoxAmount expenses={thisMonthExpenses} min={-1} max={100}/>
                    <BoxAmount expenses={thisMonthExpenses} min={100} max={-1}/>
                    <BoxAmount expenses={thisMonthExpenses} min={100} max={1000}/>
                    <BoxAmount expenses={thisMonthExpenses} min={1000} max={10000}/>
                </div>
            </div>
        </div>
    );
};

export default ExpenseView;
