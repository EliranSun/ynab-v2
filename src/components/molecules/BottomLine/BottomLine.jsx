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
                    <Amount size={Amount.Size.LARGE}>{-totalSpent}</Amount>
                    <h1 className="text-sm">
                        <Trans>Spent</Trans>
                    </h1>
                </Item>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 bg-white py-2 shadow rounded-2xl gap-8">
                        <Item>
                            <Amount withRounding>{budgetForTimeframe}</Amount>
                            <h1 className="font-mono">
                                <Trans>Budget</Trans>
                            </h1>
                        </Item>
                        <Item>
                            <Amount isDifference>{differenceBudgetAmount}</Amount>
                            <h1 className="font-mono">
                                <Trans>left</Trans>
                            </h1>
                        </Item>
                    </div>
                    <div className="grid grid-cols-2 bg-white p-2 shadow rounded-2xl gap-8">
                        <Item>
                            <Amount withRounding>{incomeAmountForTimeframe}</Amount>
                            <h1 className="font-mono"><Trans>Income</Trans></h1>
                        </Item>
                        <Item>
                            <Amount isDifference>{differenceAmount}</Amount>
                            <h1 className="font-mono">
                                <Trans>left</Trans>
                            </h1>
                        </Item>
                    </div>
                </div>
            </div>
        </div>
    )
}