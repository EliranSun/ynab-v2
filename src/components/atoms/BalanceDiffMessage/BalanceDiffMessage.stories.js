import { BalanceDiffMessage as BalanceDiffMessageComponent } from './BalanceDiffMessage';

export default {
  title: 'atoms/Balance Diff Message',
  component: BalanceDiffMessageComponent,
  parameters: {
    layout: 'padded',
  }
};

export const BalanceDiffMessage = {
  args: {
    incomeBudget: 20000,
    expensesBudget: 19000,
    totalIncomeThisMonth: 20000,
    totalExpensesThisMonth: 18000,
  },
};