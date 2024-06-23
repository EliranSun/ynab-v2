import {useContext, useMemo, useState} from "react";
import {AuthButton as AuthButton} from "../../pages/Login/AuthButton";
import {Button} from "../../atoms";
import {List} from "@phosphor-icons/react";
import {UserContext} from "../../../context";
import {BUTTON_SIZE} from "../../../constants";
import {useLingui} from "@lingui/react";
import {msg, Trans} from "@lingui/macro";
import {ButtonLink} from "../../atoms/ButtonLink";
import classNames from "classnames";
import {isDesktop, isMobile} from "../../../utils/device";

const Messages = [
    <span>Spend less than <b>120₪</b> today on food</span>,
    <span>Don't forget to <b>pay your bills</b> this week</span>,
    <span>Try to <b>save 10%</b> of your income this month</span>,
];

const Pages = {
    parse: {
        name: 'parse',
        label: msg`Parse`,
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

const Message = {
    welcome: msg`Welcome`,
    morning: msg`Good morning!`,
    afternoon: msg`Good afternoon!`,
    evening: msg`Good evening!`
}

const WelcomeMessage = ({userName}) => {
    const {_} = useLingui();
    const welcomeMessage = useMemo(() => {
        let message;
        const hour = new Date().getHours();
        if (hour < 12) {
            message = Message.morning;
        } else if (hour < 18) {
            message = Message.afternoon;
        } else {
            message = Message.evening;
        }

        return _(message);
    }, [_]);

    if (userName) {
        return (
            <p className="text-sm">
                <Trans>Hey</Trans>, {userName}, {welcomeMessage}
            </p>
        )
    }

    return (
        <p className="text-sm">
            <Trans>Hey</Trans>, {welcomeMessage}
        </p>
    )
};

const HamburgerMenu = ({onClick}) => {
    if (isDesktop()) {
        return null;
    }

    return (
        <div className="flex items-center">
            <Button
                onClick={onClick}
                type={Button.Types.GHOST}>
                <List size={BUTTON_SIZE} color="black"/>
            </Button>
        </div>
    );
};

const Menu = ({isOpen, onMenuItemClick}) => {
    const {isLoggedIn} = useContext(UserContext);
    const {_} = useLingui();
    return (
        <ul className={classNames({
            "hidden": isMobile() && !isOpen,
            "w-2/3 h-screen md:h-fit p-4 md:text-sm": true,
            "flex flex-col md:flex-row gap-6 md:gap-4 justify-end": true,
            "border-r md:border-none shadow-xl md:shadow-none md:static": true,
            "fixed z-30 top-0 rtl:left-0 ltr:right-0 bg-white": true,
        })}>
            {Object.values(Pages).map(({name, label}) => (
                <ButtonLink
                    key={name}
                    isDisabled={!isLoggedIn}
                    onClick={onMenuItemClick}
                    href={name}
                    name={name}
                    label={_(label)}/>
            ))}
            <AuthButton/>
        </ul>
    );
};

const MobileMenuBackdrop = ({isOpen}) => {
    if (isDesktop() || !isOpen) {
        return null;
    }

    return <div className="bg-black/30 backdrop-blur-sm top-0 left-0 z-20 fixed w-screen h-screen"/>;
};


export const Header = () => {
    const {user} = useContext(UserContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex">
            <header
                className={classNames({
                    "bg-white text-xs md:text-base ": true,
                    "sticky md:static top-0 p-2 md:p-4 md:h-16 w-full bg-white z-10": true,
                    "flex justify-between items-center md:gap-8": true,
                })}>
                <WelcomeMessage userName={user.displayName}/>
                <HamburgerMenu onClick={() => setIsMenuOpen(!isMenuOpen)}/>
            </header>
            <Menu isOpen={isMenuOpen} onMenuItemClick={() => setIsMenuOpen(false)}/>
            <MobileMenuBackdrop isOpen={isMenuOpen}/>
        </div>
    )
};