import {useEffect, useRef, useState} from "react";
import classNames from "classnames";
import {Expense} from "../../../models";
import {Button, Title} from "../../atoms";
import {withExpensesContext} from "../../../HOC/withExpensesContext";
import {SheetUpload} from "../../organisms/SheetUpload";
import {ExpensesList} from "./ExpensesList";
import {parseNewExpenses, isExistingExpense} from "../../../utils/expenses";
import {ClipboardText} from "@phosphor-icons/react";

const isMobile = window.innerWidth < 768;
const formatAmount = (amount) => {
    return parseFloat(amount.replace("₪", "").replace(",", "").trim());
};

const getDateTimestamp = (date) => {
    const dateParts = date?.split("/");
    const year = dateParts && dateParts[2] ? `20${dateParts[2]}` : new Date().getFullYear();
    const month = dateParts && Number(dateParts[1]);
    const day = dateParts && Number(dateParts[0]);
    return new Date(Date.UTC(year, month - 1, day)).getTime();
};

export const ParseExpensesList = ({
                                      text = "",
                                      expenses,
                                      setExpenses = () => {
                                      }
                                  }) => {
    const textAreaRef = useRef(null);
    const [message, setMessage] = useState("");
    const [value, setValue] = useState(text);
    const [isParseButtonDisabled, setIsParseButtonDisabled] = useState(false);
    const [parsedExpenses, setParsedExpenses] = useState([]);
    const [parsedFile, setParsedFile] = useState([]);
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

            const newExpenses = data.map(expense => {
                const similarExpense = expenses.find(existingItem => {
                    return existingItem.name === expense.name;
                });

                if (similarExpense?.categoryId) {
                    expense.categoryId = similarExpense.categoryId;
                }

                return expense;
            });

            setParsedExpenses(newExpenses
                .filter(item => !isExistingExpense(item, expenses))
                .map(item => new Expense(item)));
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

    console.log({expenses, parsedExpenses});

    return (
        <section className="h-screen overflow-y-auto p-4">
            <Title type={Title.Types.H1} className="flex items-center gap-2 mb-4">
                <ClipboardText/> Parse
            </Title>

            <div className="max-w-6xl m-auto">
                {parsedExpenses.length > 0 &&
                    <Title type={isMobile ? Title.Types.H3 : Title.Types.H2}>
                        Existing expenses: {expenses.length} • New expenses: {parsedExpenses.length}
                    </Title>}
                <ExpensesList
                    expenses={parsedExpenses}
                    existingExpenses={expenses}
                    setExpenses={setParsedExpenses}
                    submitExpenses={async expenses => {
                        await setExpenses(expenses);
                        const newExpenses = parsedExpenses.filter(item => !item.categoryId);
                        setParsedExpenses(newExpenses);
                        localStorage.setItem("parsed-expenses", JSON.stringify(newExpenses));
                    }}/>
            </div>
            <div className="flex items-start gap-4 max-w-7xl flex-col">
                <div className="flex flex-col md:w-1/3 h-full">
                    <Title type={Title.Types.H2} className="mb-4">Paste</Title>
                    <textarea
                        className="border border-dashed border-black p-4 outline-none w-full h-full"
                        placeholder="Paste expenses here"
                        rows={isMobile ? 5 : 15}
                        ref={textAreaRef}
                        value={value}
                        onChange={event => {
                            setIsParseButtonDisabled(!event.target.value);
                            setValue(event.target.value);
                        }}/>
                    <Button
                        size={Button.Sizes.FULL}
                        isDisabled={isParseButtonDisabled}
                        onClick={setNewExpenses}
                        className={classNames("my-4 w-72 mx-auto text-center bg-blue-400", {
                            "animate-pulse duration-500": isStatusAnimated,
                        })}>
                        {isStatusAnimated ? message : "Parse Text"}
                    </Button>
                </div>
                <div className="mb-4">
                    <Title type={Title.Types.H2} className="mb-4">Upload</Title>
                    <SheetUpload onSheetParse={data => {
                        console.log({data});
                        setParsedFile(data.map(row => ({
                            name: row["Name"] || row['שם'] || row['על מה?'],
                            timestamp: getDateTimestamp(row["Date"] || row['תאריך']),
                            amount: formatAmount(row["Amount"] || row['סכום'] || "0"),
                            categoryName: row["Category"] || row['קטגוריה'],
                        })));
                    }}/>
                    <pre>
                        {JSON.stringify(parsedFile, null, 2)}
                    </pre>
                    <Button
                        size={Button.Sizes.FULL}
                        isDisabled={isParseButtonDisabled}
                        onClick={() => {
                            const newExpenses = parsedFile.map(item => {
                                const similarExpense = expenses.find(existingItem => {
                                    return existingItem.name === item.name;
                                });

                                if (similarExpense?.categoryId) {
                                    item.categoryId = similarExpense.categoryId;
                                }

                                return item;
                            });

                            setParsedExpenses(newExpenses
                                .filter(item => !isExistingExpense(item, expenses))
                                .map(item => new Expense(item)));
                        }}
                        className={classNames("my-4 w-72 mx-auto text-center bg-blue-400", {
                            "animate-pulse duration-500": isStatusAnimated,
                        })}>
                        {isStatusAnimated ? message : "Parse File"}
                    </Button>
                </div>
                <div className="">
                    <Title type={Title.Types.H2} className="mb-4">Manual - WIP</Title>
                </div>

            </div>
        </section>
    );
};

export default withExpensesContext(ParseExpensesList);
