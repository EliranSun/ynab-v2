import { noop } from 'lodash';
import { Categories } from "../../../constants";
import classNames from "classnames";

const LeanCategorySelection = ({ onCategorySelect = noop }) => {
  return (
    <div className="flex w-full gap-1">
      {Categories.map((category) => {
        return (
          <div key={category.id} className="flex flex-col bg-gray-100 w-full">
            <div className="p-4 bg-gray-500 text-white">
              <b>{category.label}</b>
            </div>
            <div className="">
              {category.subCategories.map((sub) => {
                return (
                  <div
                    key={sub.id}
                    className={classNames("flex gap-2 py-2 px-4 text-sm hover:bg-red-500 hover:text-white cursor-pointer hover:border-black-300")}
                    onClick={() => onCategorySelect(sub.id)}>
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