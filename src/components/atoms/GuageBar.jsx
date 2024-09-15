import classNames from 'classnames';
import { formatCurrency } from '../../utils';

export const GuageBar = ({ amount, secondaryAmount, max, width = 160 }) => {
    return (
        <span 
            style={{ width }}
            className="relative h-1.5 bg-gray-200">
            <span
                style={{ width: amount / (max + 1) * width }}
                className={classNames({
                    "absolute z-20 h-1 rounded bottom-0 right-0": true,
                    "bg-green-400": amount <= max,
                    "bg-red-500": amount > max
                })} />
                {secondaryAmount ? 
                <span
                style={{ width: secondaryAmount / (max + 1) * width }}
                className={classNames({
                    "absolute h-1 rounded bottom-0 right-0": true,
                    "bg-green-500": secondaryAmount <= max,
                    "bg-red-600": secondaryAmount > max
                })} /> : null }
        </span>
    )
}