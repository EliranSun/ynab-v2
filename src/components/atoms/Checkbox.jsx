const Checkbox = ({ value, label, onChange, isChecked }) => {
    return (
        <div className="flex gap-2 border border-black cursor-pointer p-4" onClick={onChange}>
            <input
                type="checkbox"
                value={value}
                checked={isChecked}
            />
            <span>{label}</span>
        </div>
    );
};

export default Checkbox;
