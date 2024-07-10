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
import {FloppyDisk, Trash} from "@phosphor-icons/react";
import {faker} from "@faker-js/faker";

export const Subcategory = ({id, categoryId, name = "", icon = "", onUpdate, onCancel}) => {
    const [newName, setNewName] = useState(name);
    const [newIcon, setNewIcon] = useState(icon || faker.internet.emoji());
    const {setMessage} = useContext(ToastContext);

    return (
        <div
            className={classNames({
                "w-full": true,
                "text-lg": true,
                "flex flex-col items-center justify-between rounded-lg": true,
            })}>
            <div className="flex gap-1">
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
            </div>
            {/*<div className="flex gap-4">*/}
            {/*    <Button*/}
            {/*        variation={Button.Variation.SAVE}*/}
            {/*        isDisabled={!newName || !newIcon || (newName === name && newIcon === icon)}*/}
            {/*        onClick={async () => {*/}
            {/*            if (id) {*/}
            {/*                await updateSubcategory({id, name: newName, icon: newIcon, categoryId});*/}
            {/*                setMessage({*/}
            {/*                    type: ToastTypes.INFO,*/}
            {/*                    text: <Trans>Category added successfully</Trans>*/}
            {/*                });*/}
            {/*            } else {*/}
            {/*                await createSubcategory({name: newName, icon: newIcon, categoryId});*/}
            {/*                setMessage({*/}
            {/*                    type: ToastTypes.INFO,*/}
            {/*                    text: <Trans>Category updated successfully</Trans>*/}
            {/*                });*/}
            {/*            }*/}

            {/*            onUpdate();*/}
            {/*        }}>*/}
            {/*        <FloppyDisk size={28}/>*/}
            {/*    </Button>*/}
            {/*    <Button*/}
            {/*        variation={Button.Variation.DELETE}*/}
            {/*        onClick={() => {*/}
            {/*            if (!id) {*/}
            {/*                onCancel();*/}
            {/*                return;*/}
            {/*            }*/}

            {/*            setMessage({*/}
            {/*                type: ToastTypes.DANGER,*/}
            {/*                text: <Trans>Are you sure you want to delete this sub-category?</Trans>,*/}
            {/*                onConfirm: async () => {*/}
            {/*                    await deleteSubcategory(id);*/}
            {/*                    setMessage({*/}
            {/*                        type: ToastTypes.INFO,*/}
            {/*                        text: <Trans>Deleted successfully</Trans>*/}
            {/*                    });*/}
            {/*                    onUpdate();*/}
            {/*                }*/}
            {/*            });*/}
            {/*        }}>*/}
            {/*        <Trash size={28}/>*/}
            {/*    </Button>*/}
            {/*</div>*/}
        </div>
    );
};