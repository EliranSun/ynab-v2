import "chartjs-adapter-date-fns";
import {useContext, useMemo, useRef, useState} from "react";
import {orderBy} from "lodash";
import {BudgetContext, ExpensesContext} from "../../../context";
import TransactionsSection from "./TransactionsSection";
import {calcExpenses, chart, ONE_MONTH_MS, useChart} from "./utils";
import {useDebounce} from "react-use";
import {Title} from "../../atoms";
import {CategoriesContext} from "../../../context/CategoriesContext";
import {Trans} from "@lingui/macro";

const ProjectionView = ({
    lookaheadInMonths = 3,
}) => {
    const canvasRef = useRef(null);
    const [balance, setBalance] = useState(Number(localStorage.getItem("balance")));
    const [debouncedBalance, setDebouncedBalance] = useState(balance);
    const {expenses} = useContext(ExpensesContext);
    const {categories} = useContext(CategoriesContext);
    const [selectedExpenseId, setSelectedExpenseId] = useState(null);
    // const [budget] = useContext(BudgetContext);
    const expensesData = useMemo(() => {
        if (!expenses.length) {
            return [];
        }

        const orderedExpenses = orderBy(expenses, ["timestamp"], ["asc"]);
        const initDate = new Date(orderedExpenses[0].timestamp);

        return calcExpenses({
            expenses: orderedExpenses,
            initAmount: 0,
            initDate: initDate,
            categories,
        });
    }, [expenses, categories]);

    const startDate = useMemo(() => {
        if (!expensesData.length) {
            return new Date();
        }

        return new Date(expensesData[0].timestamp);
    }, [expensesData]);

    const [isReady] = useDebounce(() => {
        setDebouncedBalance(balance);
    }, 2000, [balance]);

    useChart({
        expensesData,
        budget: 0,
        balance: 0,
        initialAmount: 0,
        lookaheadInMonths,
        startDate,
        canvasRef,
    });

    const ready = isReady();

    return (
        <section className="max-w-screen-2xl h-screen m-auto my-8">
            <Title>
                <Trans>Projection</Trans>
            </Title>
            {/*<div className="text-4xl my-4">*/}
            {/*    <label htmlFor="balance">Current Balance (graph is calculated backwards):</label>*/}
            {/*    <input*/}
            {/*        name="balance"*/}
            {/*        type="number"*/}
            {/*        placeholder="Current balance"*/}
            {/*        value={balance}*/}
            {/*        onChange={(e) => {*/}
            {/*            setBalance(Number(e.target.value));*/}
            {/*            localStorage.setItem("balance", e.target.value);*/}
            {/*        }}*/}
            {/*        className="border-b border-black ml-4"/>*/}

            {/*</div>*/}
            <TransactionsSection
                selectedExpenseId={selectedExpenseId}
                setSelectedExpenseId={setSelectedExpenseId}
                data={expensesData}/>
            {!ready && <div>Calculating...</div>}
            <div
                className="h-3/5 w-full"
                // onClick={(event) => {
                //     chart.getElementsAtEventForMode(
                //         event,
                //         "nearest",
                //         {intersect: true},
                //         true
                //     )
                //         .forEach(({element}) => {
                //             const expenseId = element['$context']?.raw?.id;
                //             setSelectedExpenseId(expenseId);
                //             document
                //                 .getElementById(expenseId)
                //                 .scrollIntoView();
                //         });
                // }}
            >
                <canvas id="myChart" ref={canvasRef}></canvas>
            </div>
        </section>
    );
};

export default ProjectionView;
