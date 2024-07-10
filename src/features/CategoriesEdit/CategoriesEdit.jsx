import {getCategories} from "../../utils/db";
import {useCallback, useContext, useEffect, useState} from "react";
import {Plus} from "@phosphor-icons/react";
import {Trans} from "@lingui/macro";
import {UserContext} from "../../context";
import {Button} from "./Button";
import {Category} from "./Category";
import {Title} from "../../components";

export const CategoriesEdit = () => {
    const {user} = useContext(UserContext);
    const [categories, setCategories] = useState([]);
    const [isAddCategoryView, setIsAddCategoryView] = useState(false);
    const fetch = useCallback(() => {
        getCategories(user.uid).then(setCategories);
    }, [user]);

    useEffect(() => {
        if (!user || !user.uid) {
            return;
        }

        fetch();
    }, [user]);

    return (
        <div className="flex flex-col rounded-3xl max-w-screen-xl m-auto relative">
            <Title><Trans>Categories Edit</Trans></Title>
            <div className="absolute left-0">
                <Button
                    variation={Button.Variation.ADD}
                    onClick={() => setIsAddCategoryView(true)}>
                    <Plus size={28}/>
                    <Trans>Add Category</Trans>
                </Button>
            </div>
            <div className="flex gap-4 my-8">
                {categories.map((category) => {
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
