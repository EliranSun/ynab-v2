import React from 'react';
import {LoginWelcomeMessage} from './LoginWelcomeMessage';

export default {
    title: 'Atoms/LoginWelcomeMessage',
    component: LoginWelcomeMessage,
    argTypes: {
        position: {
            control: {type: 'radio'},
            options: Object.values(LoginWelcomeMessage.Position),
        },
    },
};

const Template = (args) => <LoginWelcomeMessage {...args} />;

export const Default = Template.bind({});
Default.args = {
    position: LoginWelcomeMessage.Position.TOP_LEFT,
};