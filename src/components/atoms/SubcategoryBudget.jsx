import classNames from "classnames";
import {formatCurrency} from "../../utils";
import {PiggyBank} from "@phosphor-icons/react";
import {useState, useRef, useContext} from "react";
import {useClickAway} from "react-use";
import {BudgetContext} from "../../context";

export const SubcategoryBudget = ({categoryId, subcategoryId, isMeetingBudget = false, budgetAmount = 0}) => {
    // eslint-disable-next-line no-undef
    const [isSettingBudget, setIsSettingBudget] = useState(false);
    const [newBudgetAmount, setNewBudgetAmount] = useState(budgetAmount);
    const ref = useRef(null);
    const {setBudget} = useContext(BudgetContext);

    useClickAway(ref, () => {
        setIsSettingBudget(false);
    });

    return (
        <div
            ref={ref}
            onClick={(event) => {
                // there's a popover when clicking on outer div, so we need to stop propagation
                event.stopPropagation();
                setIsSettingBudget(true);
            }}
            className={classNames("text-sm flex flex-col items-center font-mono", {
                "text-red-500": !isMeetingBudget,
                "text-green-600": isMeetingBudget
            })}>
            <PiggyBank/>
            {isSettingBudget ?
                <input
                    type="number"
                    value={newBudgetAmount}
                    className="flex w-fit max-w-[40px] text-center"
                    onChange={(event) => {
                        setNewBudgetAmount(Number(event.target.value));

                        setBudget({
                            amount: Number(event.target.value),
                            categoryId,
                            subcategoryId,
                        });
                    }}/> :
                formatCurrency(newBudgetAmount, false, false)}
        </div>
    );
};
