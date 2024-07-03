import {noop} from 'lodash';
import {Categories} from "../../../constants";
import classNames from "classnames";

const LeanCategorySelection = ({onCategorySelect = noop}) => {
    return (
        <div className="flex flex-col md:flex-row w-full gap-1">
            {Categories.map((category) => {
                return (
                    <div key={category.id} className="flex flex-col bg-gray-100 w-full">
                        <div className="p-4 bg-gray-500 text-white">
                            <b>{category.label}</b>
                        </div>
                        <div className="flex flex-wrap md:inline-block">
                            {category.subCategories.map((sub) => {
                                return (
                                    <div
                                        key={sub.id}
                                        onClick={() => onCategorySelect(sub.id)}
                                        className={classNames({
                                            "p-4 md:py-2 md:px-4": true,
                                            "flex gap-2 text-sm hover:bg-red-500": true,
                                            "hover:text-white cursor-pointer hover:border-black-300": true,
                                        })}>
                                        <span>{sub.icon.slice(0, 2)}</span>
                                        <span>{sub.label}</span>
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