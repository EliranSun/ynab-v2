import React from 'react';
import {ExpensesSummary} from './ExpensesSummary';
import {BrowserRouter as Router} from 'react-router-dom';
import {LocaleProvider} from "../../../context/LocaleContext";

export default {
    title: 'Organisms/ExpensesSummary',
    component: ExpensesSummary,
    decorators: [
        (Story) => (
            <Router>
                <LocaleProvider>
                    <Story/>
                </LocaleProvider>
            </Router>
        )
    ]
};

const Template = (args) => (
    <ExpensesSummary {...args}/>
);

export const Default = Template.bind({});
Default.args = {
    user: null,
};