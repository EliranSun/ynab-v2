import {useContext, useEffect, useState, useCallback} from "react";
import {ToastContext, ToastTypes} from "../../context/ToastProvider";
import {createCategory, deleteCategory, getSubcategories, updateCategory} from "../../utils/db";
import classNames from "classnames";
import {Button} from "./Button";
import {Trans} from "@lingui/macro";
import {FloppyDisk, Plus, Trash} from "@phosphor-icons/react";
import {Subcategory} from "./Subcategory";

const ICON_SIZE = 16;

export const Category = ({id, onClick, name = "", icon = "", onUpdate}) => {
    const [newName, setNewName] = useState(name);
    const [newIcon, setNewIcon] = useState(icon);
    const [isAddSubcategoryView, setIsAddSubcategoryView] = useState(false);
    const [subcategories, setSubcategories] = useState([]);
    const {setMessage} = useContext(ToastContext);
    const fetch = useCallback(() => {
        getSubcategories(id).then(setSubcategories);
    }, [id]);

    useEffect(() => {
        if (!id) {
            return;
        }

        fetch();
    }, [id]);

    return (
        <div
            className="flex flex-col gap-1 bg-gray-100 p-2 rounded-xl shadow items-center w-full md:w-[calc(50vw-2rem)]">
            <div className="bg-gray-200 p-2 rounded-lg">
                <h2 className="w-full text-left rtl:text-right"><Trans>Category</Trans></h2>
                <div
                    onClick={onClick}
                    className={classNames({
                        "w-full": true,
                        "flex flex-col items-center gap-4 justify-between": true,
                        "rounded-full": true,
                    })}>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="w-16 text-center text-3xl md:text-lg px-2 rounded-lg"
                            onChange={(e) => setNewIcon(e.target.value)}
                            value={newIcon}/>
                        <input
                            type="text"
                            className="w-full text-3xl md:text-lg px-4 rounded-lg font-mono"
                            onChange={(e) => setNewName(e.target.value)}
                            value={newName}/>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full bg-gray-200 p-2 rounded-lg">
                <h2 className="text-sm"><Trans>Subcategory</Trans></h2>
                {subcategories.length > 0 ? subcategories.map((subcategory) => {
                    return (
                        <Subcategory
                            key={subcategory.id}
                            id={subcategory.id}
                            categoryId={id}
                            name={subcategory.name}
                            icon={subcategory.icon}
                            onUpdate={fetch}
                        />
                    );
                }) : <Trans>No subcategories for this category</Trans>}
                {isAddSubcategoryView ?
                    <Subcategory
                        categoryId={id}
                        onUpdate={() => {
                            setIsAddSubcategoryView(false);
                            fetch();
                        }}
                        onCancel={() => setIsAddSubcategoryView(false)}/> : null}
                <div className="my-2">
                    <Button
                        variation={Button.Variation.ADD}
                        onClick={() => setIsAddSubcategoryView(true)}>
                        <Plus size={ICON_SIZE}/>
                        <Trans>Add Subcategory</Trans>
                    </Button>
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    variation={Button.Variation.SAVE}
                    isDisabled={newName === name && newIcon === icon}
                    onClick={async () => {
                        if (id) {
                            await updateCategory({id, name: newName, icon: newIcon});
                            setMessage({
                                type: ToastTypes.INFO,
                                text: <Trans>Category added successfully</Trans>
                            });
                        } else {
                            await createCategory({name: newName, icon: newIcon});
                            setMessage({
                                type: ToastTypes.INFO,
                                text: <Trans>Category updated successfully</Trans>
                            });
                        }

                        onUpdate();
                    }}>
                    <FloppyDisk size={ICON_SIZE}/>
                </Button>
                <Button
                    variation={Button.Variation.DELETE}
                    onClick={() => {
                        if (!id) {
                            return;
                        }

                        setMessage({
                            type: ToastTypes.DANGER,
                            text: <Trans>Are you sure you want to delete this category?</Trans>,
                            onConfirm: async () => {
                                await deleteCategory(id);
                                setMessage({
                                    type: ToastTypes.INFO,
                                    text: <Trans>Deleted successfully</Trans>
                                });
                                onUpdate();
                            }
                        });
                    }}>
                    <Trash size={ICON_SIZE}/>
                </Button>
            </div>
        </div>
    );
}