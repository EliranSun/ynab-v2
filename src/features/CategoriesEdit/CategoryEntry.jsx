import {useCallback, useContext, useEffect, useState} from "react";
import {getSubcategories} from "../../utils/db";
import {faker} from "@faker-js/faker";
import {UserContext} from "../../context";
import {TextInput} from "./TextInput";
import {Subcategories} from "./Subcategories";
import {CategoryActions} from "./CategoryActions";
import {Trans} from "@lingui/macro";
import {CategoryIncomeButton} from "./CategoryIncomeButton";
import {TooltipContext} from "../../context/TooltipContext";

export const CategoryEntry = ({id, name = "", icon = "", isIncome = false, onUpdate}) => {
    const {user} = useContext(UserContext);
    const [setTooltipMessage] = useContext(TooltipContext);
    const [newName, setNewName] = useState(name);
    const [newIcon, setNewIcon] = useState(icon || faker.internet.emoji());
    const [newIsIncome, setNewIsIncome] = useState(isIncome);
    const [subcategories, setSubcategories] = useState([]);
    const fetch = useCallback(() => {
        getSubcategories(id).then(subcategories => setSubcategories(subcategories));
    }, [id]);

    useEffect(() => {
        if (!id) {
            return;
        }

        fetch();
    }, [id]);

    return (
        <>
            <div
                className="flex flex-col gap-2 bg-gray-100 p-2 rounded-xl shadow items-center w-full md:w-[calc(50vw-2rem)]">
                <div className="bg-gray-500 w-full flex items-center text-white py-2">
                    <div className="flex items-center" onMouseEnter={() => setTooltipMessage(
                        <>
                            <Trans>A category is an group of subcategories,</Trans><br/>
                            <Trans>You can call it cosmetic - it is there solely to organize subcategories</Trans>
                        </>
                    )}>
                        <TextInput isSecondary onChange={setNewIcon} value={newIcon}/>
                        <TextInput onChange={setNewName} value={newName}/>
                    </div>
                    <CategoryIncomeButton onChange={setNewIsIncome} isIncome={newIsIncome}/>
                </div>
                <Subcategories
                    categoryId={id}
                    subcategories={subcategories}/>
                <div className="mt-4">
                    <CategoryActions
                        userId={user.uid}
                        categoryId={id}
                        onUpdate={onUpdate}
                        newEntry={{
                            name: newName,
                            icon: newIcon,
                            isIncome: newIsIncome
                        }}
                        oldEntry={{
                            name,
                            icon,
                            isIncome
                        }}/>
                </div>
            </div>
        </>
    );
}