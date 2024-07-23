import {useLingui} from "@lingui/react";
import {Trans} from "@lingui/macro";
import {Item} from "./Item";
import {Amount} from "./Amount";

export const BottomLine = ({
    totalSpent,
    timeframeName,
    budgetForTimeframe,
    incomeAmountForTimeframe,
}) => {
    const {_} = useLingui();
    const differenceBudgetAmount = budgetForTimeframe - totalSpent;
    const differenceAmount = incomeAmountForTimeframe - totalSpent;

    return (
        <div>
            <h1>{_(timeframeName)}</h1>
            <div className="flex items-center justify-evenly gap-2 my-4 m-auto">
                <Item>
                    <Amount size={Amount.Size.LARGE} isExpense>{-totalSpent}</Amount>
                    <h1 className="font-mono">
                        <Trans>Spent</Trans>
                    </h1>
                    <div className="grid grid-cols-2 py-2 px-8 gap-8">
                        <Item>
                            <Amount size={Amount.Size.SMALL} withRounding>{budgetForTimeframe}</Amount>
                            <h1 className="font-mono">
                                <Trans>Budget</Trans>
                            </h1>
                        </Item>
                        <Item>
                            <Amount size={Amount.Size.SMALL} isDifference>{differenceBudgetAmount}</Amount>
                            <h1 className="font-mono">
                                {differenceBudgetAmount > 0 ?
                                    <Trans>left</Trans> : <Trans>over</Trans>}
                            </h1>
                        </Item>
                    </div>
                </Item>

                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 bg-gray-100 px-8 p-2 shadow rounded-2xl gap-8">
                        <Item>
                            <Amount withRounding>{incomeAmountForTimeframe}</Amount>
                            <h1 className="font-mono"><Trans>Income</Trans></h1>
                        </Item>
                        <Item>
                            <Amount isDifference>{differenceAmount}</Amount>
                            <h1 className="font-mono">
                                {differenceAmount > 0 ?
                                    <Trans>left</Trans> : <Trans>over</Trans>}
                            </h1>
                        </Item>
                    </div>
                </div>
            </div>
        </div>
    )
}