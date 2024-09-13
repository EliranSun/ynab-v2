import classNames from "classnames";
import { formatCurrency } from "../../utils";
import { PiggyBank } from "@phosphor-icons/react";
import { useState, useRef, useContext } from "react";
import { useClickAway } from "react-use";
import { BudgetContext } from "../../context";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/macro";

export const SubcategoryBudget = ({ isMeetingBudget = false, budgetAmount = 0 }) => {
    // eslint-disable-next-line no-undef
    const [isSettingBudget, setIsSettingBudget] = useState(false);
    const ref = useRef(null);
    const { _ } = useLingui();

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
            className={classNames("text-sm flex gap-0 md:gap-1 flex-col items-center font-mono", {
                "text-red-500": !isMeetingBudget,
                "text-green-600": isMeetingBudget
            })}>
            {isSettingBudget ?
                <input
                    type="number"
                    value={budgetAmount}
                    className="flex w-fit max-w-[40px] text-center" /> :
                <span className="leading-3">{formatCurrency(budgetAmount, false, false)}</span>}
            <span className="text-[10px] leading-3">{_(msg`Budget`)}</span>
        </div>
    );
};
