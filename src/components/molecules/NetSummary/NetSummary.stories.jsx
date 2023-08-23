import { NetSummary as NetSummaryComponent } from "./NetSummary";
import { faker } from '@faker-js/faker';

export default {
  title: 'molecules/Net Summary',
  component: NetSummaryComponent,
};

const income = Number(faker.finance.amount({ min: 0, max: 1000000 }));
const outcome = Number(faker.finance.amount({ min: 0, max: 1000000 }));

console.log({ income, outcome });

const Template = (args) => <NetSummaryComponent {...args} />;
export const NetSummary = Template.bind({});
NetSummary.args = {
  label: "Net Worth",
  income,
  outcome
}