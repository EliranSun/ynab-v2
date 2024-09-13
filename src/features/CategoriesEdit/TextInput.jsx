import classNames from "classnames";

export const Input = ({ isSecondary, isLean, ...rest }) => {
    return (
        <input
            className={classNames({
                "shadow w-full": false,
                "leading-3": isLean,
                "text-gray-400 text-[10px]": isSecondary,
                "text-xs md:text-base": !isSecondary,
                "rounded-lg bg-transparent text-right": true,
            })}
            {...rest}
        />
    );

}
export const TextInput = ({ value, onChange, ...rest }) => {
    return (
        <Input
            type="text"
            onChange={(event) => onChange(event.target.value)}
            value={value}
            {...rest}
        />
    )
};