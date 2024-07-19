import {noop} from 'lodash';
import {Categories} from "../../../constants";
import classNames from "classnames";
import {useContext} from "react";
import {CategoriesContext} from "../../../context/CategoriesContext";

const LeanCategorySelection = ({onCategorySelect = noop}) => {
    const {categories} = useContext(CategoriesContext);

    if (!categories) {
        return null;
    }

    return (
        <div className="flex flex-col md:flex-row gap-1">
            {categories.map((category) => {
                return (
                    <div key={category.id} className="flex flex-col bg-gray-100">
                        <div className="p-4 bg-gray-500 text-white">
                            <b>{category.icon}</b> <b>{category.name}</b>
                        </div>
                        <div className="flex flex-wrap md:inline-block">
                            {category.subcategories.map((sub) => {
                                return (
                                    <div
                                        key={sub.id}
                                        onClick={() => onCategorySelect(sub.id)}
                                        className={classNames({
                                            "p-4 md:py-2 md:px-4 min-w-32": true,
                                            "flex gap-2 text-sm hover:bg-red-500": true,
                                            "hover:text-white cursor-pointer hover:border-black-300": true,
                                        })}>
                                        <span>{sub.icon.slice(0, 2)}</span>
                                        <span>{sub.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    )
};

export default LeanCategorySelection;