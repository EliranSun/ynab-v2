import {useContext, useState} from "react";
import {Button} from "./Button";
import {ToastContext, ToastTypes} from "../../context/ToastProvider";
import {Trans} from "@lingui/macro";
import {
    createSubcategory,
    deleteSubcategory,
    updateSubcategory
} from "../../utils/db";
import {FloppyDisk, Trash} from "@phosphor-icons/react";
import {faker} from "@faker-js/faker";
import {TextInput} from "./TextInput";

const ICON_SIZE = 17;

export const Subcategory = ({subcategoryId, categoryId, name = "", icon = "", onUpdate, onCancel}) => {
    const [newName, setNewName] = useState(name);
    const [newIcon, setNewIcon] = useState(icon || faker.internet.emoji());
    const {setMessage} = useContext(ToastContext);

    return (
        <div className="w-full flex gap-2">
            <div className="bg-white/90 w-full flex gap-1">
                <TextInput value={newIcon} onChange={setNewIcon} isSecondary/>
                <TextInput value={newName} onChange={setNewName}/>
            </div>
            <Button
                variation={Button.Variation.SAVE}
                isDisabled={!newName || !newIcon || (newName === name && newIcon === icon)}
                onClick={async () => {
                    if (subcategoryId) {
                        await updateSubcategory({id: subcategoryId, name: newName, icon: newIcon, categoryId});
                        setMessage({
                            type: ToastTypes.INFO,
                            text: <Trans>Category added successfully</Trans>
                        });
                    } else {
                        await createSubcategory({name: newName, icon: newIcon, categoryId});
                        setMessage({
                            type: ToastTypes.INFO,
                            text: <Trans>Category updated successfully</Trans>
                        });
                    }

                    onUpdate();
                }}>
                <FloppyDisk size={ICON_SIZE}/>
            </Button>
            {subcategoryId ?
                <Button
                    variation={Button.Variation.DELETE}
                    onClick={() => {
                        if (!subcategoryId) {
                            onCancel();
                            return;
                        }

                        setMessage({
                            type: ToastTypes.DANGER,
                            text: <Trans>Are you sure you want to delete this sub-category?</Trans>,
                            onConfirm: async () => {
                                await deleteSubcategory(subcategoryId);
                                setMessage({
                                    type: ToastTypes.INFO,
                                    text: <Trans>Deleted successfully</Trans>
                                });
                                onUpdate();
                            }
                        });
                    }}>
                    <Trash size={ICON_SIZE}/>
                </Button> : null}
        </div>
    );
};