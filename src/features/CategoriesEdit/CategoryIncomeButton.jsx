import {useContext, useState} from "react";
import {Button} from "./Button";
import {ArrowSquareIn, ArrowSquareOut} from "@phosphor-icons/react";
import {Trans} from "@lingui/macro";
import {TooltipContext} from "../../context/TooltipContext";

export const CategoryIncomeButton = ({isIncome: initIsIncome, onChange}) => {
    const [setTooltipMessage] = useContext(TooltipContext);
    const [isIncome, setIsIncome] = useState(initIsIncome);

    return (
        <Button
            className={isIncome ? "text-green-300" : "text-red-200"}
            onClick={() => {
                setIsIncome(!isIncome);
                onChange(!isIncome);
            }}
            onMouseEnter={() => setTooltipMessage(
                <>
                    <Trans>Income is defined per category level,</Trans><br/>
                    <Trans>So all of the subcategories in this category will be defined as income</Trans>
                </>
            )}>
            {isIncome ? <ArrowSquareIn/> : <ArrowSquareOut/>}
            <label className="text-xs">
                {isIncome ? <Trans>income</Trans> : <Trans>expense</Trans>}
            </label>
        </Button>
    );
};