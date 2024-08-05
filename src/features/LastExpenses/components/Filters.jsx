import classNames from "classnames";

export const Filters = ({children}) => {
    return (
        <div className={classNames({
            "flex flex-col justify-center items-start gap-2": true,
        })}>
            {children}
        </div>
    );
};