import { rest } from 'msw';
import { useState } from "react";
import { SetBudgetButton as SetBudgetButtonComponent } from "./SetBudgetButton";
import { action } from "@storybook/addon-actions";
import { BudgetContextProvider } from "../../../context";
import { Login } from "../../pages/Login";

const ControlledButton = (props) => {
  const [isBudgeting, setIsBudgeting] = useState(false);
  return <SetBudgetButtonComponent {...props} isBudgeting={isBudgeting} onClick={setIsBudgeting}/>
}

export default {
  title: 'atoms/SetBudgetButton',
  component: ControlledButton,
  decorators: [(Story) => (
    <BudgetContextProvider>
      <Login>
        <Story/>
      </Login>
    </BudgetContextProvider>
  )],
};

export const SetBudgetButton = {
  args: {
    isBudgeting: false,
    amount: 500,
    categoryBudget: 1000,
    categoryId: 1,
    subcategoryId: 11,
    timestamp: new Date().getTime(),
    onClick: action("onClick")
  },
};