import {useContext, useState} from "react";
import {faker} from "@faker-js/faker";
import {UserContext} from "../../context";
import {TextInput} from "./TextInput";
import {Subcategories} from "./Subcategories";
import {CategoryActions} from "./CategoryActions";
import {Trans} from "@lingui/macro";
import {CategoryIncomeButton} from "./CategoryIncomeButton";
import {TooltipContext} from "../../context/TooltipContext";

export const CategoryEntry = ({id, subcategories = [], name = "", icon = "", isIncome = false, onUpdate}) => {
    const {user} = useContext(UserContext);
    const [setTooltipMessage] = useContext(TooltipContext);
    const [newName, setNewName] = useState(name);
    const [newIcon, setNewIcon] = useState(icon || faker.internet.emoji());
    const [newIsIncome, setNewIsIncome] = useState(isIncome);
    const [isAddSubcategoryView, setIsAddSubcategoryView] = useState(false);

    return (
        <>
            <div
                className="flex flex-col w-full justify-between gap-2 bg-gray-100 shadow items-center w-full rounded-xl md:w-[calc(50vw-2rem)] max-w-lg">
                <div className="w-full">
                    <div className="bg-gray-500 w-full flex items-center justify-between text-white py-2 rounded-t-xl">
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
                        onUpdate={onUpdate}
                        isAddSubcategoryView={isAddSubcategoryView}
                        setIsAddSubcategoryView={setIsAddSubcategoryView}
                        subcategories={subcategories}/>
                </div>
                <div className="px-2 py-4 w-full">
                    <CategoryActions
                        userId={user.uid}
                        onAddSubcategory={() => setIsAddSubcategoryView(true)}
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