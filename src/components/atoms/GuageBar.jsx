import classNames from 'classnames';
import { formatCurrency } from '../../utils';

export const GuageBar = ({ amount, max, width = 160 }) => {
    return (
        <span
            style={{ width }}
            className="relative h-1.5 bg-gray-200 rounded">
            <span className='absolute top-1 left-0 text-[8px] -translate-y-full'>{formatCurrency(max, false, false)}</span>
            <span
                style={{ width: Math.min(amount / (max + 1) * width, width) }}
                className={classNames({
                    "absolute h-full bottom-0 right-0 rounded": true,
                    "bg-green-400": amount <= max,
                    "bg-red-500": amount > max
                })} />
        </span>
    )
}