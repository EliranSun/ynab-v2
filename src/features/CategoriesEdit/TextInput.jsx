import classNames from "classnames";

export const TextInput = ({value, onChange, isSecondary = false}) => {
    return (
        <input
            type="text"
            className={classNames({
                "shadow": false,
                "w-10": isSecondary,
                "w-full": !isSecondary,
                "text-lg px-2 rounded-lg bg-transparent text-right": true,
            })}
            onChange={(event) => onChange(event.target.value)}
            value={value}/>
    )
};