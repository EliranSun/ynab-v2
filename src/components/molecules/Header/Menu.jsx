import { useRef, useState } from "react";
import { useLingui } from "@lingui/react";
import classNames from "classnames";
import { MenuPages } from "../../../constants";
import { ButtonLink } from "../../atoms/ButtonLink";
import { useClickAway } from "react-use";

export const Menu = ({ isOpen, onMenuItemClick }) => {
	const { _ } = useLingui();
	const pathnames = window.location.pathname.split("/");
	const [selectedPage, setSelectedPage] = useState(
		pathnames[pathnames.length - 1]
	);
	const ref = useRef(null);

	useClickAway(ref, () => {
		if (isOpen) {
			onMenuItemClick();
		}
	});

	return (
		<ul
			ref={ref}
			className={classNames({
				"h-full md:text-sm bg-gray-100": true,
				"flex justify-evenly md:justify-start w-full": true,
				"border-r md:border-none md:shadow-xl md:shadow-none md:static": true,
			})}>
			{Object.values(MenuPages).map((item) => (
				<ButtonLink
					isSelected={selectedPage === item.name}
					key={item.name}
					icon={item.icon}
					href={item.name}
					name={item.name}
					label={_(item.label)}
					onClick={() => {
						onMenuItemClick();
						setSelectedPage(item.name);
					}}
				/>
			))}
		</ul>
	);
};
