import React from 'react';
import Subcategory from './Subcategory';
import {ExpensesContext} from '../../../context';

export default {
    title: 'Organisms/Subcategory',
    component: Subcategory,
    decorators: [
        (Story) => (
            <ExpensesContext.Provider value={{
                expenses: [
                    {id: 1, categoryId: 'cat1', amount: 100, timestamp: new Date()},
                    {id: 2, categoryId: 'cat1', amount: 150, timestamp: new Date()},
                ],
                expensesPerMonthPerCategory: {
                    cat1: {
                        Jan: {amount: 200},
                        Feb: {amount: 250},
                    },
                },
            }}>
                <Story/>
            </ExpensesContext.Provider>
        ),
    ],
};

const Template = (args) => <Subcategory {...args} />;

export const Default = Template.bind({});
Default.args = {
    icon: '📈',
    label: 'Sales',
    id: 'cat1',
    categoryId: 'mainCat',
    currentTimestamp: Date.now(),
    isIncome: true,
    thisMonthExpenses: [
        {id: 1, amount: 100, timestamp: Date.now()},
        {id: 2, amount: 150, timestamp: Date.now()},
    ],
    subcategoryBudget: 300,
};

export const NegativeDiff = Template.bind({});
NegativeDiff.args = {
    icon: '📉',
    label: 'Expenses',
    id: 'cat2',
    categoryId: 'mainCat',
    currentTimestamp: Date.now(),
    isIncome: false,
    thisMonthExpenses: [
        {id: 1, amount: 400, timestamp: Date.now()},
    ],
    subcategoryBudget: 300,
};

export const NoExpenses = Template.bind({});
NoExpenses.args = {
    icon: '💸',
    label: 'Empty Category',
    id: 'cat3',
    categoryId: 'mainCat',
    currentTimestamp: Date.now(),
    isIncome: false,
    thisMonthExpenses: [],
    subcategoryBudget: 0,
};

export const PreviousMonthExpenses = Template.bind({});
PreviousMonthExpenses.args = {
    icon: '🕒',
    label: 'Last Month',
    id: 'cat1',
    categoryId: 'mainCat',
    currentTimestamp: Date.now(),
    isIncome: false,
    thisMonthExpenses: [
        {id: 1, amount: 50, timestamp: Date.now()},
    ],
    subcategoryBudget: 100,
    isPreviousMonth: () => true,
};
