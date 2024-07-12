import {useContext, useState} from "react";
import {Subcategory} from "./Subcategory";
import {Trans} from "@lingui/macro";
import {TooltipContext} from "../../context/TooltipContext";

export const ICON_SIZE = 16;
export const Subcategories = ({categoryId, subcategories = []}) => {
    const [setTooltipMessage] = useContext(TooltipContext);
    const [isAddSubcategoryView, setIsAddSubcategoryView] = useState(false);

    return (
        <div
            className="flex flex-col gap-2 w-full rounded-lg"
            onMouseEnter={() => setTooltipMessage(
                <Trans>Subcategories are how expenses are grouped and calculated</Trans>
            )}>
            {subcategories.length > 0 ? subcategories.map((subcategory) => {
                return (
                    <Subcategory
                        categoryId={categoryId}
                        key={subcategory.id}
                        id={subcategory.id}
                        name={subcategory.name}
                        icon={subcategory.icon}
                        onUpdate={fetch}
                    />
                );
            }) : <Trans>No subcategories for this category</Trans>}
            {isAddSubcategoryView ?
                <Subcategory
                    categoryId={categoryId}
                    onUpdate={() => {
                        setIsAddSubcategoryView(false);
                        fetch();
                    }}
                    onCancel={() => setIsAddSubcategoryView(false)}/> : null}
            {/*<div className="my-2">*/}
            {/*    <Button*/}
            {/*        variation={Button.Variation.ADD}*/}
            {/*        onClick={() => setIsAddSubcategoryView(true)}>*/}
            {/*        <Plus size={ICON_SIZE}/>*/}
            {/*        <Trans>Add Subcategory</Trans>*/}
            {/*    </Button>*/}
            {/*</div>*/}
        </div>
    )
}