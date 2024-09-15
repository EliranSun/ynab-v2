import classNames from "classnames";
import { formatCurrency } from "../../utils";

export const GuageBar = ({ amount, secondaryAmount, max, width = 160 }) => {
	return (
		<span
			style={{ width }}
			className="relative h-1.5 bg-gray-200 border rounded">
			<span className="absolute top-1 -translate-y-full left-0 text-[8px]">
				{formatCurrency(max, false, false)}
			</span>
			<span
				style={{ width: Math.min((amount / (max + 1)) * width, width) }}
				className={classNames({
					"absolute z-20 h-1 bottom-0 right-0": true,
					"bg-green-400": secondaryAmount
						? secondaryAmount <= max
						: amount <= max,
					"bg-red-500": secondaryAmount ? secondaryAmount > max : amount > max,
					"border-l border-white": secondaryAmount,
					rounded: !secondaryAmount,
				})}
			/>
			{secondaryAmount ? (
				<span
					style={{
						width: Math.min((secondaryAmount / (max + 1)) * width, width),
					}}
					className={classNames({
						"absolute h-1 rounded bottom-0 right-0": true,
						"bg-green-600": secondaryAmount <= max,
						"bg-red-700": secondaryAmount > max,
					})}
				/>
			) : null}
		</span>
	);
};
