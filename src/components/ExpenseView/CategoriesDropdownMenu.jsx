import { noop } from "lodash";
import { Categories } from "../../constants";

export const CategoriesDropdownMenu = ({ defaultValueId = null, onCategoryChange = noop }) => {
    return (
        <select
            className="border border-black"
            value={String(defaultValueId)}
            onChange={event => {
                onCategoryChange(event.target.value);
            }}>
            {Categories.map((category) => (
                category.subCategories.map((subCategory) => {
                    return (
                        <option
                            key={subCategory.id}
                            value={subCategory.id}>
                            {category.name} > {subCategory.name}
                        </option>
                    );
                })
            ))}
        </select>
    );
};