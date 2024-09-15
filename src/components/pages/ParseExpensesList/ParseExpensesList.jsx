import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { Expense } from "../../../models";
import { Button, Title } from "../../atoms";
import { withExpensesContext } from "../../../HOC/withExpensesContext";
import { ParseExpensesListModal } from "./ParseExpensesListModal";
import { isExistingExpense, parseNewExpenses } from "../../../utils/expenses";
import { Trans } from "@lingui/macro";
import { ExportData } from "./ExportData";
import { AddExpenseEntry } from "./AddExpenseEntry";
import { Box } from "../../atoms/Box";
import { ImportFromFile } from "./ImportFromFile";
import { ImportFromSheet } from "./ImportFromSheet";

const isMobile = window.innerWidth < 768;


export const ParseExpensesList = ({
    expenses,
    setExpenses = () => {
    }
}) => {
    const textAreaRef = useRef(null);
    const [message, setMessage] = useState("");
    const [value, setValue] = useState("");
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

            const newExpenses = data.map(expense => {
                const similarExpense = expenses.find(existingItem => {
                    return existingItem.name.toLowerCase() === expense.name.toLowerCase();
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

    const parseExpensesFromText = () => {
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
                className="flex flex-col justify-center gap-2 md:gap-8 max-w-screen-2xl m-auto">
                <Title type={Title.Types.H1} className="mt-8">
                    <Trans>Add</Trans>
                </Title>
                {parsedExpenses.length > 0 &&
                    <div className="w-full">
                        <Title type={isMobile ? Title.Types.H3 : Title.Types.H2}>
                            <Trans>Existing expenses</Trans>:
                            {expenses.length} •
                            <Trans>New expenses</Trans>: {parsedExpenses.length}
                        </Title>
                    </div>}
                <div className="grid grid-cols-1 m-auto gap-8 w-full">
                    <Box>
                        <Title type={Title.Types.H2} className="mb-8">
                            <Trans>Manually</Trans>
                        </Title>
                        <AddExpenseEntry isVertical />
                    </Box>
                    <Box>
                        <Title type={Title.Types.H2} className="mb-8">
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
                            }} />
                        <Button
                            size={Button.Sizes.FULL}
                            isDisabled={value.length === 0}
                            onClick={parseExpensesFromText}
                            className={classNames("my-4 w-72 mx-auto text-center bg-blue-400", {
                                "animate-pulse duration-500": isStatusAnimated,
                            })}>
                            {isStatusAnimated ? message : <Trans>Parse Text</Trans>}
                        </Button>
                    </Box>
                    <Box>
                        <Title type={Title.Types.H2} className="mb-8">
                            <Trans>Sheet</Trans>
                        </Title>
                        <ImportFromSheet
                            message={message}
                            expenses={expenses}
                            setParsedExpenses={setParsedExpenses}
                            isStatusAnimated={isStatusAnimated} />
                    </Box>
                    {/*<ExportData/>*/}
                </div>
            </section>

            <ParseExpensesListModal
                existingExpenses={expenses}
                expenses={parsedExpenses}
                setExpenses={setParsedExpenses}
                deleteExpense={expense => {
                    const newExpenses = parsedExpenses.filter(item => item.id !== expense.id);
                    setParsedExpenses(newExpenses);
                    localStorage.setItem("parsed-expenses", JSON.stringify(newExpenses));
                }}
                submitExpenses={async expenses => {
                    await setExpenses(expenses);
                    const newExpenses = parsedExpenses.filter(item => !item.subcategoryId);
                    setParsedExpenses(newExpenses);
                    localStorage.setItem("parsed-expenses", JSON.stringify(newExpenses));
                }} />
        </>
    );
};

export default withExpensesContext(ParseExpensesList);
