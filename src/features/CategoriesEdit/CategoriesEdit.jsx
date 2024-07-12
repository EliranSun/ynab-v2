import {useContext, useState} from "react";
import {Plus} from "@phosphor-icons/react";
import {Trans} from "@lingui/macro";
import {Button} from "./Button";
import {Category} from "./Category";
import {Title} from "../../components";
import {CategoriesContext} from "../../context/CategoriesContext";

export const CategoriesEdit = () => {
    const {categories, fetch} = useContext(CategoriesContext);
    const [isAddCategoryView, setIsAddCategoryView] = useState(false);

    console.log({categories});

    return (
        <div className="flex flex-col rounded-3xl max-w-screen-xl m-auto relative">
            <Title><Trans>Categories Edit</Trans></Title>
            <div className="absolute -bottom-10 left-0">
                <Button
                    variation={Button.Variation.ADD}
                    onClick={() => setIsAddCategoryView(true)}>
                    <Plus size={28}/>
                    <Trans>Add Category</Trans>
                </Button>
            </div>
            <div className="flex flex-col md:flex-row gap-4 my-8">
                {categories.map((category, index) => {
                    return (
                        <Category
                            key={category.id}
                            id={category.id}
                            name={category.name}
                            icon={category.icon}
                            onUpdate={fetch}
                        />
                    );
                })}
                {isAddCategoryView ?
                    <Category
                        onUpdate={() => {
                            setIsAddCategoryView(false);
                            fetch();
                        }}
                    /> : null}
            </div>
        </div>
    )
};
