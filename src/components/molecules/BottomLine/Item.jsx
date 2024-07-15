export const Item = ({children}) => {
    return (
        <div className="flex flex-col md:items-start">
            {children}
        </div>
    );
};