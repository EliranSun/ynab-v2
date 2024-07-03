import {Trans} from "@lingui/macro";
import {ArrowSquareOut} from "@phosphor-icons/react";
import {Button, Title} from "../../atoms";
import classNames from "classnames";
import {useContext} from "react";
import {BudgetContext, ExpensesContext} from "../../../context";
import {Box} from "../../atoms/Box";

export const ExportData = () => {
    const {expensesArray} = useContext(ExpensesContext);
    const [budget] = useContext(BudgetContext);

    return (
        <section className="w-full flex flex-col gap-16">
            <Box>
                <Title type={Title.Types.H1}>
                    <Trans>Export Expenses</Trans>
                </Title>
                <p>
                    {expensesArray.length} expenses. Last expense:
                </p>
                <pre className="h-96 overflow-y-auto overflow-x-hidden">
                    {JSON.stringify(expensesArray.sort((a, b) => b.timestamp - a.timestamp)[0], null, 2)}
                </pre>
                <Button
                    size={Button.Sizes.FULL}
                    isDisabled={expensesArray.length === 0}
                    className={classNames("my-4 w-72 mx-auto text-center", {
                        "animate-pulse duration-500": false,
                    })}
                    onClick={() => {
                        const element = document.createElement("a");
                        const file = new Blob([JSON.stringify(expensesArray, null, 2)], {type: "text/plain"});
                        element.href = URL.createObjectURL(file);
                        element.download = "expenses.json";
                        document.body.appendChild(element);
                        element.click();
                    }}>
                    <Trans>Export expenses to file</Trans>
                </Button>
            </Box>
            <Box>
                <Title type={Title.Types.H1}>
                    <Trans>Export Budget</Trans>
                </Title>
                <pre className="h-96 overflow-y-auto overflow-x-hidden">
                    {JSON.stringify(budget, null, 2)}
                </pre>
                <Button
                    size={Button.Sizes.FULL}
                    isDisabled={Object.keys(budget).length === 0}
                    className={classNames("my-4 w-72 mx-auto text-center", {
                        "animate-pulse duration-500": false,
                    })}
                    onClick={() => {
                        const element = document.createElement("a");
                        const file = new Blob([JSON.stringify(budget, null, 2)], {type: "text/plain"});
                        element.href = URL.createObjectURL(file);
                        element.download = "budget.json";
                        document.body.appendChild(element);
                        element.click();
                    }}>
                    <Trans>Export budget to file</Trans>
                </Button>
            </Box>
        </section>
    )
};