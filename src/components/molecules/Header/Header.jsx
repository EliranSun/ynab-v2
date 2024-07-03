import {useContext, useState} from "react";
import {UserContext} from "../../../context";
import classNames from "classnames";
import {WelcomeMessage} from "./WelcomeMessage";
import {HamburgerMenu} from "./HamburgerMenu";
import {MobileMenuBackdrop} from "./MobileMenuBackdrop";
import {Menu} from "./Menu";


export const Header = () => {
    const {user} = useContext(UserContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex sticky md:static top-0">
            <header
                className={classNames({
                    "bg-white text-xs md:text-base": true,
                    " p-2 md:p-4 md:h-16 w-screen bg-white z-10": true,
                    "flex justify-between items-center md:gap-8": true,
                    "rtl:flex-row-reverse": true,
                })}>
                <WelcomeMessage userName={user.displayName}/>
                <HamburgerMenu onClick={() => setIsMenuOpen(!isMenuOpen)}/>
            </header>
            <Menu
                isOpen={isMenuOpen}
                onMenuItemClick={() => setIsMenuOpen(false)}/>
            <MobileMenuBackdrop isOpen={isMenuOpen}/>
        </div>
    )
};