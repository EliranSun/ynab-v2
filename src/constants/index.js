import {msg} from "@lingui/macro";

export * from "./categories";
export {default as Pages} from "./Pages";
export * from "./Expenses";

export const BUTTON_SIZE = 32;
export const MOBILE_BUTTON_SIZE = 18;
const Messages = [
    <span>Spend less than <b>120₪</b> today on food</span>,
    <span>Don't forget to <b>pay your bills</b> this week</span>,
    <span>Try to <b>save 10%</b> of your income this month</span>,
];
export const MenuPages = {
    home: {
        name: 'home',
        label: msg`Home`,
    },
    import: {
        name: 'import',
        label: msg`Parse`,
    },
    budget: {
        name: 'budget',
        label: msg`Budget`,
    },
    balance: {
        name: 'balance',
        label: msg`Balance`,
    },
    expenses: {
        name: 'expenses',
        label: msg`Expenses`,
    },
    categories: {
        name: 'categories',
        label: msg`Categories`,
    },
    projection: {
        name: 'projection',
        label: msg`Projection`,
    },
    resolver: {
        name: 'resolver',
        label: msg`Resolver`,
    },
};
const PageTitle = {
    parse: msg`Parse`,
    balance: msg`Balance: Where's my fucking money?`,
    expenses: msg`Expenses`,
    categories: msg`Categories`,
    projection: msg`Projection`,
    resolver: msg`Resolver`,
};
export const Message = {
    welcome: msg`Welcome`,
    morning: msg`Good morning!`,
    afternoon: msg`Good afternoon!`,
    evening: msg`Good evening!`
}