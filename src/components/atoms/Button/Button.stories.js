import { noop } from 'lodash';
import ButtonComponent from './Button';
import { PiggyBank } from "@phosphor-icons/react";
import { action } from '@storybook/addon-actions';

const ButtonChildren = () => {
  return (
    <>
      <PiggyBank weight="fill" size={17}/>
      Click Me
    </>
  );
};

const onClick = action("CLICKED!");

export default {
  title: 'atoms/Button',
  component: ButtonComponent,
  parameters: {
    layout: 'padded',
  },
  argsTypes: {
    type: {
      control: { type: 'select' },
      options: Object.values(ButtonComponent.Types),
    },
    onClick: {
      action: 'clicked',
    }
  }
};

export const Primary = {
  args: {
    children: <ButtonChildren/>,
    isDisabled: false,
    onClick,
    type: ButtonComponent.Types.PRIMARY
  },
};

export const Secondary = {
  args: {
    children: <ButtonChildren/>,
    isDisabled: false,
    onClick,
    type: ButtonComponent.Types.SECONDARY
  },
};

export const Danger = {
  args: {
    children: <ButtonChildren/>,
    isDisabled: false,
    onClick,
    type: ButtonComponent.Types.DANGER
  },
};

export const Ghost = {
  args: {
    children: <ButtonChildren/>,
    isDisabled: false,
    onClick,
    type: ButtonComponent.Types.GHOST
  },
};