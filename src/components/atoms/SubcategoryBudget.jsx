import classNames from "classnames";
import {formatCurrency} from "../../utils";
import {PiggyBank} from "@phosphor-icons/react";
import {useState, useRef, useContext} from "react";
import {useClickAway} from "react-use";
import {BudgetContext} from "../../context";

export const SubcategoryBudget = ({isMeetingBudget = false, budgetAmount = 0}) => {
    // eslint-disable-next-line no-undef
    const [isSettingBudget, setIsSettingBudget] = useState(false);
    const ref = useRef(null);

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
            className={classNames("text-sm flex gap-1 md:flex-col items-center font-mono", {
                "text-red-500": !isMeetingBudget,
                "text-green-600": isMeetingBudget
            })}>
            <PiggyBank/>
            {isSettingBudget ?
                <input
                    type="number"
                    value={budgetAmount}
                    className="flex w-fit max-w-[40px] text-center"/> :
                formatCurrency(budgetAmount, false, false)}
        </div>
    );
};
