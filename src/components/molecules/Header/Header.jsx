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
        <div className="flex sticky top-0 py-3 z-40 bg-white w-screen border-b">
            <header
                className={classNames({
                    "max-w-screen-2xl m-auto": true,
                    "bg-white text-xs md:text-base": true,
                    "md:h-16 w-full bg-white z-10": true,
                    "flex justify-between items-center md:gap-8": true,
                    "rtl:flex-row-reverse": false,
                })}>
                <span className="hidden lg:inline w-40">
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