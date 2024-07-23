import {useMemo} from "react";
import {Trans} from "@lingui/macro";
import classNames from "classnames";
import {formatCurrency} from "../../utils";

export const BudgetInfoType = {
    INCOME: 'INCOME',
    EXPENSES: 'EXPENSES',
    DIFFERENCE: 'DIFFERENCE',
};
export const BudgetInfoCard = ({amount, type}) => {
    const label = useMemo(() => {
        switch (type) {
            case BudgetInfoType.INCOME:
                return <Trans>Total Income Budget:</Trans>;
            case BudgetInfoType.EXPENSES:
                return <Trans>Total Expenses Budget:</Trans>;
            case BudgetInfoType.DIFFERENCE:
                return <Trans>Total budgeted savings:</Trans>;
            default:
                return '';
        }
    }, [type]);

    return (
        <div className="w-full flex flex-col items-center">
            <div className={classNames({
                "text-5xl": true,
                "text-green-500": type === BudgetInfoType.DIFFERENCE && amount > 0,
                "text-red-500": type === BudgetInfoType.DIFFERENCE && amount < 0,
            })}>
                {formatCurrency(amount, false, false)}
            </div>
            <span>{label}</span>
        </div>
    );
};