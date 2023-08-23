import Component from "./LeanCategorySelection";
import { action } from "@storybook/addon-actions";

export default {
  title: "organisms/Lean Category Selection",
  component: Component,
}

const Template = (args) => <Component {...args} />;

export const LeanCategorySelection = Template.bind({});
LeanCategorySelection.args = {
  onCategorySelect: action("onCategorySelect")
};