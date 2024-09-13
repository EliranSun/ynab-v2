import { useContext, useState } from "react";
import { UserContext } from "../../../context";
import classNames from "classnames";
import { WelcomeMessage } from "./WelcomeMessage";
import { HamburgerMenu } from "./HamburgerMenu";
import { MobileMenuBackdrop } from "./MobileMenuBackdrop";
import { Menu } from "./Menu";
import { Search } from "../../../features/Search";
import { useLingui } from "@lingui/react";
import { Scales } from "@phosphor-icons/react";

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { AuthButton } = useContext(UserContext);

    return (
        <div className="flex sticky top-0 z-40 bg-gray-100 w-screen border-b">
            <header
                className={classNames({
                    "w-full max-w-screen-2xl m-auto": true,
                    "text-xs md:text-base": true,
                    "md:h-16 z-10 px-4 py-2 my-2": true,
                    "flex justify-between items-center md:gap-8": true,
                    "rtl:flex-row-reverse": false,
                })}>
                <div className="text-amber-500 flex items-center gap-1">
                    <Scales size={32} />
                    <h1 className="text-2xl font-bold pt-1">UNAB</h1>
                </div>
                {/*<span className="hidden lg:inline w-40">*/}
                {/*    <WelcomeMessage userName={user.translatedUsername}/>*/}
                {/*</span>*/}
                {/*<HamburgerMenu onClick={() => setIsMenuOpen(!isMenuOpen)}/>*/}
                <div className="w-full md:w-1/3 h-full">
                    <Search />
                </div>
                <div className="fixed left-0 z-10 h-20 bottom-0 md:relative w-full md:w-2/3 md:h-full">
                    <Menu
                        isOpen={isMenuOpen}
                        onMenuItemClick={() => setIsMenuOpen(false)} />
                </div>
                {/*<AuthButton/>*/}
            </header>
            <MobileMenuBackdrop isOpen={isMenuOpen} />
        </div>
    )
};