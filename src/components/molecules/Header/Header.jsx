import {useContext, useMemo, useState} from "react";
import {LoginButton} from "../../pages/Login/LoginButton";
import {Button} from "../../atoms";
import {List} from "@phosphor-icons/react";
import {UserContext} from "../../../context";
import {BUTTON_SIZE} from "../../../constants";
import {ButtonLink, isDesktop} from "../../atoms/ButtonLink";
import {useParams} from "react-router-dom";
import classNames from "classnames";

const isMobile = window.innerWidth < 768;

const Messages = [
    () => <span>Spend less than <b>120₪</b> today on food</span>,
    () => <span>Don't forget to <b>pay your bills</b> this week</span>,
    () => <span>Try to <b>save 10%</b> of your income this month</span>,
];

const PageTitle = {
    parse: "Parse",
    balance: "Balance: Where'd my money go?",
    expenses: "Expenses",
    categories: "Categories",
    projection: "Projection",
    resolver: "Resolver",
};

export const Header = () => {
    const {page} = useParams();
    const [user] = useContext(UserContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const message = useMemo(() => {
        let message = `Hey ${user.displayName.split(" ")[0]}, `;
        const hour = new Date().getHours();
        if (hour < 12) {
            message += "Good morning!";
        } else if (hour < 18) {
            message += "Good afternoon!";
        } else {
            message += "Good evening!";
        }

        return message;
    }, [user]);

    const closeMenu = () => setIsMenuOpen(false);
    const RandomMessage = Messages[Math.floor(Math.random() * Messages.length)];

    return (
        <>
            <div
                className="sticky top-0 bg-white z-20 text-xs md:text-base flex justify-between items-center md:gap-8 md:p-4 md:h-16 shadow-xl">
                {isMobile &&
                    <div className="flex items-center">
                        <Button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            type={Button.Types.GHOST}>
                            <List size={BUTTON_SIZE} color="black"/>
                        </Button>
                        <div>
                            {/*{message}*/}
                            {/*<br/>*/}
                            {/*<div className="text-blue-400">*/}
                            {/*    <RandomMessage/>*/}
                            {/*</div>*/}
                            <div className="text-lg">{PageTitle[page]}</div>
                        </div>
                    </div>}
                {(isDesktop || isMenuOpen) &&
                    <ul className={classNames({
                        "p-4": true,
                        "border-r md:border-none": true,
                        "h-screen flex flex-col md:flex-row md:justify-end md:gap-4": true,
                        "md:h-fit": true,
                    })}>
                        <ButtonLink onClick={closeMenu} name="home"/>
                        <ButtonLink onClick={closeMenu} name="import"/>
                        <ButtonLink onClick={closeMenu} name="balance"/>
                        <ButtonLink onClick={closeMenu} name="expenses"/>
                        <ButtonLink onClick={closeMenu} name="categories"/>
                        <ButtonLink onClick={closeMenu} name="projection"/>
                        <ButtonLink onClick={closeMenu} name="resolver"/>
                        {isMobile && <hr/>}
                        <ButtonLink onClick={closeMenu} name="coffee"/>
                        <ButtonLink onClick={closeMenu} name="patreon"/>
                    </ul>}
                <LoginButton/>
            </div>
            {isMenuOpen && isMobile && <div className="backdrop-brightness-50 fixed w-screen h-screen"/>}
        </>
    )
};