import {noop} from "lodash";
import {useEffect, useState} from "react";
import {useDebounce} from "react-use";

export const SearchInput = ({
    placeholder = "Search through expenses",
    onChange = noop,
    onFocus = noop,
    value: initValue = ""
}) => {
    const [value, setValue] = useState(initValue);

    useEffect(() => {
        setValue(initValue);
    }, [initValue]);

    useDebounce(
        () => {
            onChange(value);
        },
        500,
        [value]
    );
    return (
        <input
            className="relative w-full h-16 text-xl border rounded-xl px-8"
            type="text"
            placeholder={placeholder}
            value={value}
            onFocus={() => {
                if (value && value.length >= 3) {
                    onFocus();
                }
            }}
            onChange={(event) => {
                setValue(event.target.value);
            }}
        />
    );
}