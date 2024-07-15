import React from 'react';
import {BottomLine} from './BottomLine';
import {Item} from './Item';
import {Amount} from './Amount';
import {setupI18n} from '@lingui/core';
import {I18nProvider} from '@lingui/react';
import catalog from '../locales/en/messages';

const i18n = setupI18n({
    language: 'en',
    catalogs: {en: catalog},
});

export default {
    title: 'Components/BottomLine',
    component: BottomLine,
    decorators: [
        (Story) => (
            <I18nProvider i18n={i18n}>
                <Story/>
            </I18nProvider>
        ),
    ],
};

const Template = (args) => <BottomLine {...args} />;

export const Default = Template.bind({});
Default.args = {
    totalSpent: 500,
    timeframeName: 'Monthly',
    budgetForTimeframe: 1000,
    incomeAmountForTimeframe: 1500,
};

export const OverBudget = Template.bind({});
OverBudget.args = {
    totalSpent: 1200,
    timeframeName: 'Monthly',
    budgetForTimeframe: 1000,
    incomeAmountForTimeframe: 1500,
};

export const UnderIncome = Template.bind({});
UnderIncome.args = {
    totalSpent: 500,
    timeframeName: 'Monthly',
    budgetForTimeframe: 1000,
    incomeAmountForTimeframe: 600,
};

export const ZeroSpent = Template.bind({});
ZeroSpent.args = {
    totalSpent: 0,
    timeframeName: 'Monthly',
    budgetForTimeframe: 1000,
    incomeAmountForTimeframe: 1500,
};