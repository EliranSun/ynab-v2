import {useContext, useState} from "react";
import {UserContext} from "../../../context";
import classNames from "classnames";
import {WelcomeMessage} from "./WelcomeMessage";
import {HamburgerMenu} from "./HamburgerMenu";
import {MobileMenuBackdrop} from "./MobileMenuBackdrop";
import {Menu} from "./Menu";
import {Search} from "../../../features/Search";
import {useLingui} from "@lingui/react";

export const Header = () => {
    const {_} = useLingui();
    const {user} = useContext(UserContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex sticky md:static top-0 z-40 w-screen">
            <header
                className={classNames({
                    "bg-white text-xs md:text-base": true,
                    " p-2 md:p-4 md:h-16 w-full bg-white z-10": true,
                    "flex justify-between items-center md:gap-8": true,
                    "rtl:flex-row-reverse": false,
                })}>
                <span className="hidden lg:inline">
                    <WelcomeMessage userName={user.translatedUsername}/>
                </span>
                <Search/>
                <HamburgerMenu onClick={() => setIsMenuOpen(!isMenuOpen)}/>
                <Menu
                    isOpen={isMenuOpen}
                    onMenuItemClick={() => setIsMenuOpen(false)}/>
            </header>
            <MobileMenuBackdrop isOpen={isMenuOpen}/>
        </div>
    )
};