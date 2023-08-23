import Amount from './Amount';

export default {
  title: 'atoms/Amount',
  component: Amount,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export const Primary = {
  args: {
    amount: 1000,
    label: 'Amount',
    isPositive: true,
    isVisible: true,
    isCurrency: true
  },
};

export const Secondary = {
  args: {
    label: 'Button',
  },
};

export const Large = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Small = {
  args: {
    size: 'small',
    label: 'Button',
  },
};
