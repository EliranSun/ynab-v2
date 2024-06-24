import {Button} from "../index";
import {CheckFat, PiggyBank, Spinner} from "@phosphor-icons/react";
import {useContext, useState} from "react";
import {BudgetContext} from "../../../context";
import {noop} from "lodash";
import {BUTTON_SIZE} from "../../../constants";

const isMobile = window.innerWidth < 768;

export const SetBudgetButton = ({
                                    isBudgeting = false,
                                    amount = 0,
                                    categoryBudget,
                                    categoryId,
                                    subcategoryId,
                                    timestamp,
                                    onClick = noop
                                }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Button
            type={Button.Types.GHOST_BORDERED}
            size={isMobile ? Button.Sizes.FULL : Button.Sizes.DEFAULT}
            onClick={async (event) => {
                event.stopPropagation();
                if (isBudgeting && amount !== categoryBudget?.amount) {
                    setIsLoading(true);
                    setIsLoading(false);
                }

                onClick(!isBudgeting);
            }}>
            {isBudgeting
                ? isLoading
                    ? <Spinner className="animate-spin" size={BUTTON_SIZE} color="black"/>
                    : <CheckFat size={BUTTON_SIZE} color="black"/>
                : <PiggyBank size={BUTTON_SIZE} color="black"/>}
        </Button>
    )
};
