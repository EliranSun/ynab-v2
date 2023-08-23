import { ThisMonthBalance as Component } from "./ThisMonthBalance";
import { BudgetContextProvider } from "../../../context";
import { Login } from "../../pages/Login";
import { faker } from "@faker-js/faker";

export default {
  title: "molecules/This Month Balance",
  component: Component,
  decorators: [(Story) => (
    <BudgetContextProvider>
      <Login>
        <Story/>
      </Login>
    </BudgetContextProvider>
  )],
}

const Template = (args) => <Component {...args} />;

export const ThisMonthBalance = Template.bind({});
ThisMonthBalance.args = {
  incomeBudget: faker.finance.amount(),
  expensesBudget: faker.finance.amount(),
  totalIncomeThisMonth: faker.finance.amount(),
  totalExpensesThisMonth: faker.finance.amount(),
}