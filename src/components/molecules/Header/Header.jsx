import {useContext, useMemo, useState} from "react";
import {AuthButton as AuthButton} from "../../pages/Login/AuthButton";
import {Button} from "../../atoms";
import {List} from "@phosphor-icons/react";
import {UserContext} from "../../../context";
import {BUTTON_SIZE} from "../../../constants";
import {ButtonLink, isDesktop} from "../../atoms/ButtonLink";
import {useParams} from "react-router-dom";
import {useLingui} from "@lingui/react";
import {msg, Trans} from "@lingui/macro";
import classNames from "classnames";

const isMobile = window.innerWidth < 768;

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
}

export const Header = () => {
    const {page} = useParams();
    const [user] = useContext(UserContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {_} = useLingui();

    const welcomeMessage = useMemo(() => {
        if (!user) {
            return _(Message.welcome);
        }

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
    }, [user, _]);

    const closeMenu = () => setIsMenuOpen(false);

    console.log({welcomeMessage});

    return (
        <>
            <header
                className="bg-white text-xs md:text-base flex justify-between items-center md:gap-8 md:p-4 md:h-16 shadow-xl">
                <div className="flex items-center gap-4">
                    {isMobile ?
                        <div className="flex items-center">
                            <Button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                type={Button.Types.GHOST}>
                                <List size={BUTTON_SIZE} color="black"/>
                            </Button>
                        </div> : null}
                    <AuthButton/>
                    <WelcomeMessage userName={user?.displayName?.split(" ")[0]}/>
                </div>
                {(isDesktop || isMenuOpen) &&
                    <ul className={classNames({
                        "flex flex-col md:flex-row md:gap-4 md:justify-end": true,
                        "w-2/3 h-screen md:h-fit p-4 md:text-sm": true,
                        "border-r md:border-none": true,
                    })}>
                        {Object.values(Pages).map(({name, label}) => (
                            <ButtonLink
                                onClick={closeMenu}
                                href={name}
                                name={name}
                                label={_(label)}/>
                        ))}
                    </ul>}
            </header>
            {isMenuOpen && isMobile &&
                <div className="backdrop-brightness-50 fixed w-screen h-screen"/>}

            {/*<h1 className="text-lg">*/}
            {/*    {page ? _(PageTitle[page]) : "♎ You need balance!"}*/}
            {/*</h1>*/}
        </>
    )
};