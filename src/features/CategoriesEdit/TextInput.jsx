import classNames from "classnames";

export const Input = ({isSecondary, ...rest}) => {
    return (
        <input
            className={classNames({
                "shadow": false,
                "w-10": isSecondary,
                "w-full": !isSecondary,
                "text-lg px-2 rounded-lg bg-transparent text-right": true,
            })}
            {...rest}
        />
    );

}
export const TextInput = ({value, onChange, isSecondary = false, ...rest}) => {
    return (
        <Input
            type="text"
            onChange={(event) => onChange(event.target.value)}
            value={value}
            {...rest}
        />
    )
};