import classNames from "classnames";

export const Banner = ({children, className}) => {
    return (
        <section
            className={classNames(className, {
                "bg-neutral-50 py-4 px-2": true,
                "shadow-md border-2 border-solid rounded-lg": true,
            })}>
            {children}
        </section>
    )
}