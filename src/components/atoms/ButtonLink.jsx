import { noop } from "lodash";
import { Link } from "react-router-dom";
import { BUTTON_SIZE } from "../../constants";
import { isDesktop } from "../../utils/device";
import classNames from "classnames";

// let link = `/${name}`;
// if (name === "coffee") {
//     link = "https://www.buymeacoffee.com/omriharel";
// }
//
// if (name === "patreon") {
//     link = "https://www.patreon.com/omriharel";
// }

export const ButtonLink = ({
	icon: Icon,
	label,
	onClick = noop,
	href,
	isDisabled,
	isSelected,
}) => {
	return (
		<li
			className={classNames({
				"w-20 text-[10px]": true,
				"p-2 flex items-center justify-center h-full hover:bg-amber-500 hover:text-black": true,
				"pointer-events-none": isDisabled,
				"text-amber-700 font-bold": isSelected,
				// "border-2 border-amber-400 text-black": !isSelected,
			})}>
			<Link
				to={href}
				onClick={onClick}
				className="flex flex-col items-center gap-0">
				<Icon size={BUTTON_SIZE} />
				{isDesktop() ? <span>{label.toUpperCase()}</span> : null}
			</Link>
		</li>
	);
};
