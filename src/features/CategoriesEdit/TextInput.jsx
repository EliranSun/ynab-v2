import classNames from "classnames";

export const Input = ({isSecondary, ...rest}) => {
    return (
        <input
            className={classNames({
                "shadow": false,
                "w-10": isSecondary,
                "w-full ": !isSecondary,
                "rounded-lg bg-transparent text-right": true,
            })}
            {...rest}
        />
    );

}
export const TextInput = ({value, onChange, ...rest}) => {
    return (
        <Input
            type="text"
            onChange={(event) => onChange(event.target.value)}
            value={value}
            {...rest}
        />
    )
};