import {useContext, useState} from "react";
import {Plus} from "@phosphor-icons/react";
import {Trans} from "@lingui/macro";
import {Button} from "./Button";
import {CategoryEntry} from "./CategoryEntry";
import {Title} from "../../components";
import {CategoriesContext} from "../../context/CategoriesContext";
import {TooltipContext} from "../../context/TooltipContext";

export const CategoriesEdit = () => {
    const {categories, fetch} = useContext(CategoriesContext);
    const [setTooltipMessage] = useContext(TooltipContext);
    const [isAddCategoryView, setIsAddCategoryView] = useState(false);

    return (
        <div className="flex flex-col rounded-3xl max-w-screen-xl m-auto relative">
            <Title><Trans>Categories Edit</Trans></Title>
            <div
                className="absolute -bottom-10 left-0"
                onMouseEnter={() => setTooltipMessage(
                    <>
                        <Trans>A category is an group of subcategories,</Trans><br/>
                        <Trans>You can call it cosmetic - it is there solely to organize subcategories</Trans>
                    </>
                )}>
                <Button
                    variation={Button.Variation.ADD}
                    onClick={() => setIsAddCategoryView(true)}>
                    <Plus size={28}/>
                    <Trans>Add Category</Trans>
                </Button>
            </div>
            <div
                className="grid grid-cols-4 gap-4 my-8 h-fit">
                {categories.map((category, index) => {
                    return (
                        <CategoryEntry
                            key={category.id}
                            id={category.id}
                            isIncome={category.isIncome}
                            subcategories={category.subcategories}
                            name={category.name}
                            icon={category.icon}
                            onUpdate={fetch}
                        />
                    );
                })}
                {isAddCategoryView ?
                    <CategoryEntry
                        onUpdate={() => {
                            setIsAddCategoryView(false);
                            fetch();
                        }}
                    /> : null}
            </div>
        </div>
    )
};
