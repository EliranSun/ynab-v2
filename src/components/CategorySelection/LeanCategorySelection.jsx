import { noop } from 'lodash';
import { Categories } from "../../constants";
import classNames from "classnames";

const LeanCategorySelection = ({ onCategorySelect = noop }) => {
  return (
    <div className="flex w-full lg:gap-2">
      {Categories.map((category) => {
        return (
          <div key={category.id} className="flex flex-col bg-gray-100">
            <div>
              <b>{category.name}</b>
            </div>
            <div className="">
              {category.subCategories.map((sub) => {
                return (
                  <div
                    key={sub.id}
                    className={classNames("mx-2 border-b border-red-500 text-sm hover:bg-red-500 hover:text-white cursor-pointer hover:border-black-300 lg:px-2 lg:py-px")}
                    onClick={() => onCategorySelect(sub.id)}>
                    <span>{sub.icon} {sub.name}</span>
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