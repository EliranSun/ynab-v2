import AmountComponent from './Amount';

export default {
  title: 'atoms/Amount',
  component: AmountComponent,
  parameters: {
    layout: 'padded',
  }
};

export const Amount = {
  args: {
    amount: 1000,
    label: 'Amount',
    isPositive: true,
    isVisible: true,
  },
};