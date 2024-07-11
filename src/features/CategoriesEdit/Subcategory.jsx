import {useContext, useState} from "react";
import classNames from "classnames";
import {Button} from "./Button";
import {ToastContext, ToastTypes} from "../../context/ToastProvider";
import {Trans} from "@lingui/macro";
import {
    createSubcategory,
    deleteSubcategory,
    updateSubcategory
} from "../../utils/db";
import {FloppyDisk, Trash, DotsThree} from "@phosphor-icons/react";
import {faker} from "@faker-js/faker";

const ICON_SIZE = 10;

export const Subcategory = ({id, categoryId, name = "", icon = "", onUpdate, onCancel}) => {
    const [newName, setNewName] = useState(name);
    const [newIcon, setNewIcon] = useState(icon || faker.internet.emoji());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {setMessage} = useContext(ToastContext);

    return (
        <div
            className={classNames({
                "w-full": true,
                "text-lg": true,
                "flex flex-col items-center justify-between rounded-lg": true,
            })}>
            <div className="flex gap-1 w-full">
                <input
                    type="text"
                    placeholder="Subcategory Icon"
                    className="rounded px-2 w-16 text-center"
                    onChange={(e) => setNewIcon(e.target.value)}
                    value={newIcon}/>
                <input
                    type="text"
                    placeholder="Subcategory Name"
                    className="rounded px-2 w-full"
                    onChange={(e) => setNewName(e.target.value)}
                    value={newName}/>
                <Button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <DotsThree/>
                </Button>
            </div>
            {isMenuOpen ?
                <div className="absolute bg-white p-2 flex gap-1">
                    <Button
                        variation={Button.Variation.SAVE}
                        isDisabled={!newName || !newIcon || (newName === name && newIcon === icon)}
                        onClick={async () => {
                            if (id) {
                                await updateSubcategory({id, name: newName, icon: newIcon, categoryId});
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
                    <Button
                        variation={Button.Variation.DELETE}
                        onClick={() => {
                            if (!id) {
                                onCancel();
                                return;
                            }

                            setMessage({
                                type: ToastTypes.DANGER,
                                text: <Trans>Are you sure you want to delete this sub-category?</Trans>,
                                onConfirm: async () => {
                                    await deleteSubcategory(id);
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
                </div> : null}
        </div>
    );
};