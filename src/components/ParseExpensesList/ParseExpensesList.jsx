import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { Expense } from "../../models";
import { Button, Title } from "../atoms";
import { withExpensesContext } from "../../HOC/withExpensesContext";
import { SheetUpload } from "../SheetUpload";
import { ExpensesList } from "./ExpensesList";

const isExistingExpense = (newExpense, expenses) => {
    return expenses.find((expense) => {
        return (
            expense.name === newExpense.name &&
            expense.timestamp === newExpense.timestamp &&
            newExpense.amount === expense.amount
        );
    });
};

const parseNewExpenses = (text = '', existingExpenses = []) => {
    const rows = text.split("\n");
    return rows.map((row) => {
        const cells = row.split("\t");
        const name = cells[0];
        const amount = cells[4];
        const dateParts = cells[1]?.split("/");
        const year = dateParts && `20${dateParts[2]}`;
        const month = dateParts && Number(dateParts[1]) - 1;
        const day = dateParts && dateParts[0];
        const timestamp = new Date(Date.UTC(year, month, day)).getTime();
        const parsedAmount =
            amount &&
            parseFloat(amount.replace(",", "").replace("₪", "").trim());

        if (!name || !parsedAmount || !timestamp) {
            return {};
        }

        return new Expense({
            name: name,
            timestamp: timestamp,
            amount: parsedAmount,
            note: cells[5],
        });
    })
        .filter((row) => {
            if (isExistingExpense(row, existingExpenses)) {
                return false;
            }

            return row.name && row.amount && row.timestamp;
        });
};

export const ParseExpensesList = ({
    text = "", expenses, setExpenses = () => {
    }
}) => {
    const textAreaRef = useRef(null);
    const [message, setMessage] = useState("");
    const [value, setValue] = useState(text);
    const [isParseButtonDisabled, setIsParseButtonDisabled] = useState(false);
    const [parsedExpenses, setParsedExpenses] = useState([]);
    const [isStatusAnimated, setIsStatusAnimated] = useState(false);


    useEffect(() => {
        if (isStatusAnimated) {
            setTimeout(() => {
                setIsStatusAnimated(false);
            }, 3000);
        }
    }, [parsedExpenses, isStatusAnimated]);

    useEffect(() => {
        const savedTextareaValue = localStorage.getItem("textarea-value");
        const savedParsedExpenses = localStorage.getItem("parsed-expenses");

        if (savedParsedExpenses) {
            const data = JSON.parse(savedParsedExpenses);
            console.log(data.length);

            setParsedExpenses(data.filter(item => {
                return !isExistingExpense(item, expenses);
            }).map(item => new Expense(item)));
        }

        if (savedTextareaValue) {
            setValue(savedTextareaValue);
        }
    }, [expenses]);

    useEffect(() => {
        if (!value) {
            return;
        }

        localStorage.setItem("textarea-value", value);
    }, [value]);

    useEffect(() => {
        if (!parsedExpenses.length) {
            return;
        }

        localStorage.setItem("parsed-expenses", JSON.stringify(parsedExpenses));
    }, [parsedExpenses]);

    const setNewExpenses = () => {
        if (!textAreaRef.current) {
            return;
        }

        setIsStatusAnimated(true);
        const newExpenses = parseNewExpenses(textAreaRef.current.value, expenses);

        if (newExpenses.length === 0) {
            setMessage("Nothing new");
            return;
        }

        setMessage(`${newExpenses.length} new expenses`);
        setParsedExpenses(newExpenses);
        localStorage.setItem("parsed-expenses", JSON.stringify(newExpenses));
    }

    return (
        <div className="m-8">
            <Title type={Title.Types.H1}>Parse expenses</Title>
            <Title type={Title.Types.H2}>
                Existing expenses: {expenses.length}
                {parsedExpenses.length ? ` • New expenses: ${parsedExpenses.length}` : ''}
            </Title>
            <div className="flex items-start gap-4 max-w-7xl flex-col-reverse xl:flex-row">
                <div className="flex flex-col w-1/3 h-full">
                    <div className="">
                        <Title type={Title.Types.H2}>Upload a sheet</Title>
                        <SheetUpload onSheetParse={data => {
                        }}/>
                    </div>
                    <textarea
                        className="border border-dashed border-black p-4 outline-none w-full h-full"
                        placeholder="Paste expenses here"
                        rows={20}
                        ref={textAreaRef}
                        value={value}
                        onChange={event => {
                            setIsParseButtonDisabled(!event.target.value);
                            setValue(event.target.value);
                        }}/>
                    <Button
                        className={classNames("my-4", {
                            "animate-pulse duration-500": isStatusAnimated,
                        })}
                        isDisabled={isParseButtonDisabled}
                        onClick={setNewExpenses}>
                        {isStatusAnimated ? message : "Parse expenses"}
                    </Button>
                </div>
                <ExpensesList
                    expenses={parsedExpenses}
                    existingExpenses={expenses}
                    setExpenses={setParsedExpenses}
                    submitExpenses={setExpenses}/>
            </div>
        </div>
    );
};

export default withExpensesContext(ParseExpensesList);
