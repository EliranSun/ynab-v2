import Component from "./CategorySelection";
import { Expense } from "../../../models";

export default {
  title: "organisms/Category Selection",
  component: Component,
}

const Template = (args) => <Component {...args} />;

export const CategorySelection = Template.bind({});
CategorySelection.args = {
  expenses: new Array(10).fill(null).map((_, index) => {
    return new Expense({
      id: index,
      description: `Expense ${index}`,
      amount: 100,
      date: new Date(),
      categoryId: null,
    });
  }),
  lean: false
}