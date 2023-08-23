import { Button } from "./index";
import { CheckFat, PiggyBank, Spinner } from "@phosphor-icons/react";
import { useContext, useState } from "react";
import { BudgetContext } from "../../context";
import { noop } from "lodash";

export const SetBudgetButton = ({
  isBudgeting = false,
  amount = 0,
  categoryBudget,
  categoryId,
  subcategoryId,
  timestamp,
  onClick = noop
}) => {
  const { setBudget } = useContext(BudgetContext);
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <Button
      type={Button.Types.GHOST}
      onClick={async (event) => {
        event.stopPropagation();
        if (isBudgeting && amount !== categoryBudget?.amount) {
          setIsLoading(true);
          await setBudget({
            amount: amount,
            categoryId,
            subcategoryId,
            timestamp
          });
          setIsLoading(false);
        }
        
        onClick(!isBudgeting);
      }}>
      {isBudgeting
        ? isLoading
          ? <Spinner className="animate-spin" size={21}/>
          : <CheckFat size={21}/>
        : <PiggyBank size={21}/>}
    </Button>
  )
};
