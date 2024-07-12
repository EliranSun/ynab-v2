import {useContext} from "react";
import {Subcategory} from "./Subcategory";
import {Trans} from "@lingui/macro";
import {TooltipContext} from "../../context/TooltipContext";

export const ICON_SIZE = 17;

export const Subcategories = ({
                                  categoryId,
                                  subcategories = [],
                                  isAddSubcategoryView,
                                  setIsAddSubcategoryView,
                                  onUpdate
                              }) => {
    const [setTooltipMessage] = useContext(TooltipContext);

    return (
        <div
            className="relative flex flex-col gap-2 p-2 w-full rounded-lg"
            onMouseEnter={() => setTooltipMessage(
                <Trans>Subcategories are how expenses are grouped and calculated</Trans>
            )}>
            <div className="flex flex-col gap-px">
                {subcategories.length > 0 ? subcategories.map((subcategory) => {
                    return (
                        <Subcategory
                            categoryId={categoryId}
                            key={subcategory.id}
                            subcategoryId={subcategory.id}
                            name={subcategory.name}
                            icon={subcategory.icon}
                            onUpdate={onUpdate}
                        />
                    );
                }) : <Trans>No subcategories for this category</Trans>}
                {isAddSubcategoryView ?
                    <Subcategory
                        categoryId={categoryId}
                        onUpdate={() => {
                            setIsAddSubcategoryView(false);
                            onUpdate();
                        }}
                        onCancel={() => setIsAddSubcategoryView(false)}/> : null}
            </div>
        </div>
    )
}