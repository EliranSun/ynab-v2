import {useEffect, useRef, useState} from "react";
import classNames from "classnames";
import {Expense} from "../../../models";
import {Button, Title} from "../../atoms";
import {withExpensesContext} from "../../../HOC/withExpensesContext";
import {SheetUpload} from "../../organisms/SheetUpload";
import {ExpensesList} from "./ExpensesList";
import {isExistingExpense, parseNewExpenses} from "../../../utils/expenses";
import {Trans} from "@lingui/macro";
import {ExportData} from "./ExportData";
import {addExpenses} from "../../../utils";
import {AddExpenseEntry} from "./AddExpenseEntry";
import {Box} from "../../atoms/Box";

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
                                      expenses,
                                      setExpenses = () => {
                                      }
                                  }) => {
    const textAreaRef = useRef(null);
    const [message, setMessage] = useState("");
    const [value, setValue] = useState("");
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
            setMessage(<Trans>Nothing new</Trans>);
            return;
        }

        setMessage(`${newExpenses.length} new expenses`);
        setParsedExpenses(newExpenses);
        localStorage.setItem("parsed-expenses", JSON.stringify(newExpenses));
    }

    return (
        <>
            <section
                className="flex flex-col justify-center gap-2 md:gap-16 items-center max-w-screen-xl m-auto px-4 md:px-8">
                <div className="w-full">
                    {parsedExpenses.length > 0 &&
                        <Title type={isMobile ? Title.Types.H3 : Title.Types.H2}>
                            <Trans>Existing expenses</Trans>:
                            {expenses.length} •
                            <Trans>New expenses</Trans>: {parsedExpenses.length}
                        </Title>}
                </div>
                <Box>
                    <Title type={Title.Types.H1} className="mb-2">
                        <Trans>Manually</Trans>
                    </Title>
                    <AddExpenseEntry/>
                </Box>
                <Box>
                    <Title type={Title.Types.H1} className="mb-4">
                        <Trans>From Text</Trans>
                    </Title>
                    <textarea
                        className="border border-dashed border-black p-4 outline-none w-full h-full"
                        placeholder="Paste expenses here"
                        rows={isMobile ? 5 : 15}
                        ref={textAreaRef}
                        value={value}
                        onChange={event => {
                            setValue(event.target.value);
                        }}/>
                    <Button
                        size={Button.Sizes.FULL}
                        isDisabled={value.length === 0}
                        onClick={setNewExpenses}
                        className={classNames("my-4 w-72 mx-auto text-center bg-blue-400", {
                            "animate-pulse duration-500": isStatusAnimated,
                        })}>
                        {isStatusAnimated ? message : <Trans>Parse Text</Trans>}
                    </Button>
                </Box>
                <Box>
                    <div className="flex w-full justify-center gap-8">
                        <div>
                            <Title type={Title.Types.H1} className="mb-4">
                                <Trans>From File</Trans>
                            </Title>
                            <input
                                type="file"
                                name="upload-json"
                                id="upload-json"
                                onChange={(event) => {
                                    event.preventDefault();
                                    if (event.target.files) {
                                        const reader = new FileReader();
                                        reader.onload = async (e) => {
                                            const data = e.target.result;
                                            const expenses = JSON.parse(data);

                                            try {
                                                await addExpenses(expenses);
                                                alert("Expenses added to user!");
                                            } catch (error) {
                                                console.error(error);
                                            }
                                        };
                                        reader.readAsText(event.target.files[0]);
                                    }
                                }}/>
                        </div>
                        <div>
                            <Title type={Title.Types.H1} className="mb-4">
                                <Trans>Sheet</Trans>
                            </Title>
                            <SheetUpload onSheetParse={data => {
                                setParsedFile(data.map(row => ({
                                    name: row["Name"] || row['שם'] || row['על מה?'],
                                    timestamp: getDateTimestamp(row["Date"] || row['תאריך']),
                                    amount: formatAmount(row["Amount"] || row['סכום'] || "0"),
                                    categoryName: row["Category"] || row['קטגוריה'],
                                })));
                            }}/>
                        </div>
                    </div>

                    <Button
                        size={Button.Sizes.FULL}
                        isDisabled={Boolean(parsedFile.length === 0)}
                        className={classNames("my-4 w-72 mx-auto text-center bg-blue-400", {
                            "animate-pulse duration-500": isStatusAnimated,
                        })}
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
                        }}>
                        {isStatusAnimated ? message : <Trans>Parse File</Trans>}
                    </Button>
                </Box>
                <ExportData/>
            </section>

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
        </>
    );
};

export default withExpensesContext(ParseExpensesList);
