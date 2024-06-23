import {CategoriesIds, getCategoryName, getSubCategoryIcon, getSubCategoryName} from "../../constants";
import {InitBudget} from "../../constants/init-budget";
import {formatCurrency} from "../../utils";
import {Trans} from "@lingui/macro";
import {useContext, useMemo, useState} from "react";
import {ExpensesContext} from "../../context";
import {getAverageSubcategoryAmount, getLastSubcategoryAmount} from "../../utils/expenses";
import classNames from "classnames";
import {toNumber} from "lodash";

const BudgetInfoType = {
    INCOME: 'INCOME',
    EXPENSES: 'EXPENSES',
    DIFFERENCE: 'DIFFERENCE',
};

const cleanAmountValue = (value) => {
    return toNumber(value.replace(/[^0-9.]/g, ''));
}

const BudgetInfoCard = ({amount, type}) => {
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
                "text-4xl": true,
                "text-green-500": type === BudgetInfoType.DIFFERENCE && amount > 0,
                "text-red-500": type === BudgetInfoType.DIFFERENCE && amount < 0,
            })}>
                {formatCurrency(amount, false, false)}
            </div>
            <span>{label}</span>
        </div>
    );
};

const SubcategoryBudget = ({
                               id,
                               amount = 0,
                               expenses = {},
                               cutoffInMonths = 3,
                               onChange,
                           }) => {
    const label = useMemo(() => getSubCategoryName(id), [id]);
    const icon = useMemo(() => getSubCategoryIcon(id), [id]);
    const average = useMemo(() => {
        return getAverageSubcategoryAmount(id, expenses, cutoffInMonths);
    }, [id, cutoffInMonths, expenses]);
    const last = useMemo(() => {
        return getLastSubcategoryAmount(id, expenses);
    }, [id, expenses]);

    return (
        <div
            key={id}
            className="flex flex-col gap-2 p-2 bg-white justify-center items-center border rounded-xl">
            <input
                type="text"
                className="text-3xl text-center font-mono w-28"
                onChange={(e) => onChange(id, e.target.value)}
                defaultValue={formatCurrency(amount, false, false)}/>
            <p>{icon} {label}</p>
            <div className="flex gap-2 text-xs">
                <div className="flex flex-col items-center">
                    <span>{formatCurrency(average, false, false)}</span>
                    <Trans>Average</Trans>
                </div>
                <div className="flex flex-col items-center">
                    <span>{formatCurrency(last, false, false)}</span>
                    <Trans>Last</Trans>
                </div>
            </div>
        </div>
    );
}

export const ManageBudget = () => {
    const [budget, setBudget] = useState(InitBudget);
    const [cutOffInMonths, setCutOffInMonths] = useState(3);
    const {expensesPerMonthPerCategory} = useContext(ExpensesContext);

    const totalBudget = useMemo(() => {
        const totalBudget = {
            expenses: 0,
            income: 0,
        };

        Object.entries(budget).forEach(([categoryId, value]) => {
            Object.entries(value).forEach(([subcategoryId, amount]) => {
                if (Number(categoryId) === CategoriesIds.Income) {
                    totalBudget.income += amount;
                } else {
                    totalBudget.expenses += amount;
                }
            });
        });

        return totalBudget;
    }, [budget]);

    return (
        <section className="max-w-screen-xl m-auto">
            <h1 className="text-5xl">
                <Trans>Budget</Trans>
            </h1>
            <div className="flex gap-4">
                <div className="sticky top-0 p-4 bg-white border-b shadow h-fit">
                    <div className="flex w-full flex-col justify-evenly gap-4 m-auto mb-2">
                        <BudgetInfoCard amount={totalBudget.income} type={BudgetInfoType.INCOME}/>
                        <BudgetInfoCard amount={totalBudget.expenses} type={BudgetInfoType.EXPENSES}/>
                        <BudgetInfoCard amount={totalBudget.income - totalBudget.expenses}
                                        type={BudgetInfoType.DIFFERENCE}/>
                    </div>
                    <div className="text-2xl text-center">
                        <Trans>Cutoff by</Trans>
                        <input
                            type="number"
                            value={cutOffInMonths}
                            onChange={(event) => setCutOffInMonths(Number(event.target.value))}
                            className="text-center text-3xl font-mono w-16 px-2"/>
                        <Trans>months</Trans>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(budget)
                        .sort(([a], [b]) => {
                            if (Number(a) === Number(CategoriesIds.Income)) {
                                return -1;
                            }

                            if (Number(b) === Number(CategoriesIds.Income)) {
                                return 1;
                            }

                            return 0;
                        })
                        .map(([category, value]) => {
                            return (
                                <div key={category}
                                     className="flex flex-col w-fit gap-4 p-4 bg-gray-50/50 flex-wrap border rounded-xl">
                                    <h2>{getCategoryName(category)}</h2>
                                    <div className="flex flex-wrap gap-4">
                                        {Object.entries(value)
                                            .sort((a, b) => {
                                                const [_a, amountA] = a;
                                                const [_b, amountB] = b;
                                                return amountB - amountA;
                                            })
                                            .map(([subcategoryId, amount]) => {
                                                return (
                                                    <SubcategoryBudget
                                                        key={subcategoryId}
                                                        id={subcategoryId}
                                                        amount={amount}
                                                        cutoffInMonths={cutOffInMonths}
                                                        expenses={expensesPerMonthPerCategory || {}}
                                                        onChange={(id, value) => {
                                                            setBudget((prev) => {
                                                                return {
                                                                    ...prev,
                                                                    [category]: {
                                                                        ...prev[category],
                                                                        [id]: cleanAmountValue(value),
                                                                    },
                                                                };
                                                            });
                                                        }}/>
                                                )
                                            })}
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>
        </section>
    )
};