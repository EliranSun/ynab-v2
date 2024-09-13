import {useLingui} from "@lingui/react";
import {Trans} from "@lingui/macro";
import {Item} from "./Item";
import {Amount} from "./Amount";
import classNames from "classnames";
import {Banner} from "../../atoms/Banner";

export const BottomLine = ({
    totalSpent,
    timeframeName,
    budgetForTimeframe,
    incomeAmountForTimeframe,
}) => {
    const differenceBudgetAmount = budgetForTimeframe - totalSpent;
    const differenceAmount = incomeAmountForTimeframe - totalSpent;

    return (
        <Banner>
            <div className={classNames({
                "flex flex-col md:flex-row": true,
                "items-start md:items-center justify-evenly": true,
                "gap-2": true,
                "px-4 md:px-0": true,
                "m-auto max-w-screen-lg": true
            })}>
                <Item>
                    <h1 className="font-mono text-green-600"><Trans>Income</Trans></h1>
                    <Amount withRounding>{incomeAmountForTimeframe}</Amount>
                </Item>
                <Item>
                    <h1 className="font-mono text-red-600">
                        <Trans>Expenses</Trans>
                    </h1>
                    <Amount size={Amount.Size.MEDIUM} isExpense>{-totalSpent}</Amount>
                    {/*<div className="grid grid-cols-2 py-2 px-8 gap-8">*/}
                    {/*    <Item>*/}
                    {/*        <Amount size={Amount.Size.SMALL} withRounding>{budgetForTimeframe}</Amount>*/}
                    {/*        <h1 className="font-mono">*/}
                    {/*            <Trans>Budget</Trans>*/}
                    {/*        </h1>*/}
                    {/*    </Item>*/}
                    {/*    <Item>*/}
                    {/*        <Amount size={Amount.Size.SMALL} isDifference>{differenceBudgetAmount}</Amount>*/}
                    {/*        <h1 className="font-mono">*/}
                    {/*            {differenceBudgetAmount > 0 ?*/}
                    {/*                <Trans>left</Trans> : <Trans>over</Trans>}*/}
                    {/*        </h1>*/}
                    {/*    </Item>*/}
                    {/*</div>*/}
                </Item>
                <Item>
                    <h1 className="font-mono">
                        <Trans>Bottom line</Trans> -{' '}
                        <span className={classNames({
                            "text-green-600": differenceAmount >= 0,
                            "text-red-600": differenceAmount < 0,
                        })}>
                        {differenceAmount >= 0 ? <Trans>left</Trans> : <Trans>over</Trans>}
                        </span>
                    </h1>
                    <Amount isDifference>{differenceAmount}</Amount>
                </Item>
            </div>
        </Banner>
    )
}