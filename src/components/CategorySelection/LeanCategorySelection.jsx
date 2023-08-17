import classNames from "classnames";
import { Categories } from "../../constants";
import { noop } from 'lodash';

const LeanCategorySelection = ({ onCategorySelect = noop }) => {
  return (
      <div className="flex w-full">
        {Categories.map((category) => {
          return (
              <div key={category.id} className="flex flex-col bg-gray-100 m-px">
                <div>
                  <b>{category.name}</b>
                </div>
                <div className="">
                  {category.subCategories.map((sub) => {
                    return (
                        <div
                            key={sub.id}
                            className={classNames("mx-2 border-b border-red-500 text-sm hover:bg-red-500 hover:text-white cursor-pointer hover:border-black-300")}
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