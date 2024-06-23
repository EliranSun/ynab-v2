import {CategoriesIds, getCategoryName, getSubCategoryIcon, getSubCategoryName} from "../../constants";
import {InitBudget} from "../../constants/init-budget";
import {formatCurrency} from "../../utils";
import {Trans} from "@lingui/macro";
import {useMemo} from "react";

const BudgetInfoType = {
    INCOME: 'INCOME',
    EXPENSES: 'EXPENSES',
    DIFFERENCE: 'DIFFERENCE',
};

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
        <div className="flex flex-col items-center">
            <div className="text-4xl">
                {formatCurrency(amount, false, false)}
            </div>
            {label}
        </div>
    );
};

export const ManageBudget = () => {
    const totalBudget = useMemo(() => {
        const totalBudget = {
            expenses: 0,
            income: 0,
        };

        Object.entries(InitBudget).forEach(([categoryId, value]) => {
            Object.entries(value).forEach(([subcategoryId, amount]) => {
                if (Number(categoryId) === CategoriesIds.Income) {
                    totalBudget.income += amount;
                } else {
                    totalBudget.expenses += amount;
                }
            });
        });

        return totalBudget;
    }, []);

    return (
        <section className="p-4 max-w-screen-lg m-auto">
            <h1 className="text-5xl">
                <Trans>Budget</Trans>
            </h1>
            <div className="flex justify-between gap-4 w-1/2 m-auto">
                <BudgetInfoCard amount={totalBudget.income} type={BudgetInfoType.INCOME}/>
                <BudgetInfoCard amount={totalBudget.expenses} type={BudgetInfoType.EXPENSES}/>
                <BudgetInfoCard amount={totalBudget.income - totalBudget.expenses} type={BudgetInfoType.DIFFERENCE}/>
            </div>
            {Object.entries(InitBudget).map(([category, value]) => {
                return (
                    <div key={category}
                         className="flex flex-col gap-4 w-full p-4 flex-wrap border rounded-xl">
                        <h2>{getCategoryName(category)}</h2>
                        <div className="flex flex-wrap gap-4">
                            {Object.entries(value).map(([subcategoryId, amount]) => {
                                const label = getSubCategoryName(subcategoryId);
                                const icon = getSubCategoryIcon(subcategoryId);

                                return (
                                    <div
                                        key={subcategoryId}
                                        className="flex flex-col gap-2 p-2 justify-center items-center border rounded-xl">
                                        <input
                                            type="text"
                                            className="text-3xl text-center font-mono w-28"
                                            defaultValue={formatCurrency(amount, false, false)}/>
                                        <p className="">
                                            {icon} {label}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            })}
        </section>
    )
};