import {msg} from "@lingui/macro";
import {
    ArrowSquareIn,
    ChartLineUp,
    Coffee,
    House,
    MagicWand, PiggyBank,
    Receipt,
    Scales,
    SquaresFour
} from "@phosphor-icons/react";

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
        icon: House,
    },
    import: {
        name: 'import',
        label: msg`Parse`,
        icon: ArrowSquareIn,
    },
    budget: {
        name: 'budget',
        label: msg`Budget`,
        icon: PiggyBank,
    },
    balance: {
        name: 'balance',
        label: msg`Balance`,
        icon: Scales,
    },
    expenses: {
        name: 'expenses',
        label: msg`Expenses`,
        icon: Receipt,
    },
    categories: {
        name: 'categories',
        label: msg`Categories`,
        icon: SquaresFour,
    },
    editCategories: {
        name: 'categories-edit',
        label: msg`Edit Categories`,
        icon: SquaresFour,
    },
    projection: {
        name: 'projection',
        label: msg`Projection`,
        icon: ChartLineUp,
    },
    resolver: {
        name: 'resolver',
        label: msg`Resolver`,
        icon: MagicWand,
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