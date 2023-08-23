import { PastTwelveMonthsBalance as Component } from "./PastTwelveMonthsBalance";
import { BudgetContextProvider } from "../../../context";
import { Login } from "../../pages/Login";

export default {
  title: 'molecules/Past Twelve Months Balance',
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
export const PastTwelveMonthsBalance = Template.bind({});

PastTwelveMonthsBalance.args = {
  timestamp: Date.now(),
}