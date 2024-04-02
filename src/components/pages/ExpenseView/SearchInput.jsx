import { noop } from "lodash";
import { useState } from "react";
import { useDebounce } from "react-use";

export const SearchInput = ({
    placeholder = "Search through expenses",
    onChange = noop
}) => {
    const [value, setValue] = useState("");
    useDebounce(
        () => {
            onChange(value);
        },
        500,
        [value]
    );
    return (
        <input
            className="w-full h-16 md:w-2/5 text-xl border-b border-black"
            type="text"
            placeholder={placeholder}
            onChange={(event) => {
                setValue(event.target.value);
            }}
        />
    );
}