import React from 'react';
import {LastExpenses} from './LastExpenses';
import {BrowserRouter as Router} from 'react-router-dom';
import {LocaleProvider} from "../../../context/LocaleContext";

export default {
    title: 'Organisms/LastExpenses',
    component: LastExpenses,
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
    <LastExpenses {...args}/>
);

export const Default = Template.bind({});
Default.args = {
    user: null,
};