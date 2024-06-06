import React from 'react';
import {Header} from './Header';
import {UserContext} from '../../../context';
import {BrowserRouter as Router} from 'react-router-dom';
import {I18nProvider} from '@lingui/react';
import {i18n} from "@lingui/core";

// i18n.load({
//     en: enMessages,
// });
// i18n.activate("en");

export default {
    title: 'Molecules/Header',
    component: Header,
    decorators: [
        (Story) => (
            <Router>
                <I18nProvider i18n={i18n}>
                    <Story/>
                </I18nProvider>
            </Router>
        ),
    ],
};

const Template = (args) => (
    <UserContext.Provider value={[args.user]}>
        <Header/>
    </UserContext.Provider>
);

export const LoggedOut = Template.bind({});
LoggedOut.args = {
    user: null,
};

export const LoggedIn = Template.bind({});
LoggedIn.args = {
    user: {
        displayName: 'John Doe',
    },
};

export const MobileView = Template.bind({});
MobileView.parameters = {
    viewport: {
        defaultViewport: 'mobile1',
    },
};
MobileView.args = {
    user: {
        displayName: 'John Doe',
    },
};

export const DesktopView = Template.bind({});
DesktopView.parameters = {
    viewport: {
        defaultViewport: 'desktop',
    },
};
DesktopView.args = {
    user: {
        displayName: 'John Doe',
    },
};