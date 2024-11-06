import { useState } from "react";
import classNames from "classnames";
import { Menu } from "./Menu";
import { Search } from "../../../features/Search";
import { Scales } from "@phosphor-icons/react";

const Logo = () => {
	return (
		<div className="text-amber-500 flex items-center gap-1 hidden md:flex">
			<Scales size={32} />
			<h1 className="text-2xl font-bold pt-1">UNAB</h1>
		</div>
	);
};

export const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<div className="flex fixed md:sticky pb-4 md:pb-0 bottom-0 md:top-0 z-40 bg-gray-100 w-screen border-b">
			<header
				className={classNames({
					"w-full max-w-screen-2xl m-auto": true,
					"text-xs md:text-base": true,
					"md:h-16 z-10 md:px-4 md:py-2 my-1": true,
					"flex flex-col md:flex-row justify-between items-center md:gap-8": true,
					"rtl:flex-row-reverse": false,
				})}>
				<Logo />
				<Menu
					isOpen={isMenuOpen}
					onMenuItemClick={() => setIsMenuOpen(false)}
				/>
				<Search />
			</header>
		</div>
	);
};
