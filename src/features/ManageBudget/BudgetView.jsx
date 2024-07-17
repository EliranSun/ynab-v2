import {CategoriesIds, getCategoryName, getSubCategoryIcon, getSubCategoryName} from "../../constants";
import {InitBudget} from "../../constants/init-budget";
import {formatCurrency, updateBudget} from "../../utils";
import {Trans} from "@lingui/macro";
import {useContext, useMemo, useState} from "react";
import {BudgetContext, ExpensesContext} from "../../context";
import {getAverageSubcategoryAmount, getLastSubcategoryAmount} from "../../utils/expenses";
import classNames from "classnames";
import {toNumber, isEqual} from "lodash";
import {Button} from "../../components";
import {CategoriesContext} from "../../context/CategoriesContext";

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
            className="flex flex-col gap-2 w-fit justify-center items-center">
            <input
                type="text"
                className="text-3xl text-center font-mono w-40 p-4"
                onChange={(e) => onChange(id, e.target.value)}
                defaultValue={formatCurrency(amount, false, false)}/>
            <p>{icon} {label}</p>
            {/*<div className="flex gap-2 text-xs">*/}
            {/*    <div className="flex flex-col items-center">*/}
            {/*        <span>{formatCurrency(average, false, false)}</span>*/}
            {/*        <Trans>Average</Trans>*/}
            {/*    </div>*/}
            {/*    <div className="flex flex-col items-center">*/}
            {/*        <span>{formatCurrency(last, false, false)}</span>*/}
            {/*        <Trans>Last</Trans>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}

export const BudgetView = () => {
    const [cutOffInMonths, setCutOffInMonths] = useState(3);
    const [budget, setBudget] = useContext(BudgetContext);
    const {expensesPerMonthPerCategory} = useContext(ExpensesContext);
    const {categories} = useContext(CategoriesContext);

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
        <section className="max-w-screen-xl m-auto relative">
            <h1 className="text-6xl my-8">
                <Trans>Budget</Trans>
            </h1>
            <div className="absolute top-10 left-0">
                <Button
                    type={Button.Types.PRIMARY}
                    isDisabled={isEqual(budget, InitBudget)}
                    onClick={async () => {
                        console.log('Save budget', budget);
                        try {
                            await updateBudget(budget);
                        } catch (error) {
                            console.error("Error saving budget", error);
                        }
                    }}>
                    <Trans>Save Budget</Trans>
                </Button>
            </div>
            <div className="flex flex-col gap-4">
                <div className="sticky top-0 p-4 bg-white border-b shadow-lg h-fit">
                    <div className="flex w-full justify-evenly gap-4 m-auto mb-2">
                        <BudgetInfoCard amount={totalBudget.income} type={BudgetInfoType.INCOME}/>
                        <BudgetInfoCard amount={totalBudget.expenses} type={BudgetInfoType.EXPENSES}/>
                        <BudgetInfoCard amount={totalBudget.income - totalBudget.expenses}
                                        type={BudgetInfoType.DIFFERENCE}/>
                    </div>
                    <div className="text-xl text-center">
                        <Trans>Cutoff by</Trans>
                        <input
                            type="number"
                            value={cutOffInMonths}
                            onChange={(event) => setCutOffInMonths(Number(event.target.value))}
                            className="text-center text-3xl font-mono w-16 px-2"/>
                        <Trans>months</Trans>
                    </div>
                </div>
                <div className="flex gap-4">
                    {categories.map(category => {
                        return (
                            <div key={category}
                                 className="flex flex-col p-2 bg-gray-50/50 flex-wrap border rounded-xl">
                                <h2 className="text-xl">{category.icon} {category.name}</h2>
                                <div className="flex flex-wrap gap-2">
                                    {category.subcategories.map((subcategory) => {
                                        const subcategoryBudget = budget.find((item) => item.subcategoryId === subcategory.id);

                                        return (
                                            <SubcategoryBudget
                                                key={subcategory.id}
                                                id={subcategory.id}
                                                amount={subcategoryBudget?.amount || 0}
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