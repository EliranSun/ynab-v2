import {useEffect, useRef, useState} from "react";
import classNames from "classnames";
import {Expense} from "../../../models";
import {Button, Title} from "../../atoms";
import {withExpensesContext} from "../../../HOC/withExpensesContext";
import {SheetUpload} from "../../organisms/SheetUpload";
import {ExpensesList} from "./ExpensesList";
import {parseNewExpenses, isExistingExpense} from "../../../utils/expenses";
import {ArrowSquareIn} from "@phosphor-icons/react";
import {Trans} from "@lingui/macro";
import {ExportData} from "./ExportData";
import {addExpensesToUser} from "../../../utils";

const isMobile = window.innerWidth < 768;

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

    return (
        <div className="flex flex-col justify-center md:flex-row gap-2 items-start">
            <section className="p-4">
                <Title type={Title.Types.H1} className="flex items-center gap-2 mb-4">
                    <ArrowSquareIn size={50}/>
                    <Trans>Import</Trans>
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
                    <div className="flex flex-col h-full">
                        <Title type={Title.Types.H2} className="mb-4">
                            <Trans>From Text</Trans>
                        </Title>
                        <textarea
                            className="border border-dashed border-black p-4 outline-none w-96 h-full"
                            placeholder="Paste expenses here"
                            rows={isMobile ? 5 : 15}
                            ref={textAreaRef}
                            value={value}
                            onChange={event => {
                                setIsParseButtonDisabled(!event.target.value);
                                setValue(event.target.value);
                            }}/>
                    </div>
                    <div className="mb-4">
                        <Title type={Title.Types.H2} className="mb-4">
                            <Trans>From Sheet/XLS</Trans>
                        </Title>
                        <SheetUpload onSheetParse={data => console.log(data)}/>
                    </div>
                    <div className="mb-4">
                        <Title type={Title.Types.H2} className="mb-4">
                            <Trans>From JSON (use export ↗)</Trans>
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
                                        console.log(expenses);

                                        try {
                                            await addExpensesToUser(expenses);
                                            alert("Expenses added to user!");
                                        } catch (error) {
                                            console.error(error);
                                        }
                                    };
                                    reader.readAsText(event.target.files[0]);
                                }
                            }}/>
                    </div>
                    <div className="">
                        <Title type={Title.Types.H2} className="mb-4">
                            Manually - TBD
                        </Title>
                    </div>
                    <Button
                        size={Button.Sizes.FULL}
                        isDisabled={isParseButtonDisabled}
                        onClick={setNewExpenses}
                        className={classNames("my-4 w-72 mx-auto text-center", {
                            "animate-pulse duration-500": isStatusAnimated,
                        })}>
                        {isStatusAnimated ? message : "Parse expenses"}
                    </Button>
                </div>
            </section>
            <ExportData/>
        </div>
    );
};

export default withExpensesContext(ParseExpensesList);
