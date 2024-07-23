import {useContext} from "react";
import {ToastContext, ToastTypes} from "../../context/ToastProvider";
import {Button} from "./Button";
import {createCategory, deleteCategory, updateCategory} from "../../utils/db";
import {Trans} from "@lingui/macro";
import {FloppyDisk, Plus, Trash} from "@phosphor-icons/react";
import {ICON_SIZE} from "./Subcategories";
import {isEqual} from "lodash";
import {useMemo} from "react";
import {TooltipContext} from "../../context/TooltipContext";


export const CategoryActions = ({categoryId, newEntry, oldEntry, onUpdate, onAddSubcategory}) => {
    const [setTooltipMessage] = useContext(TooltipContext);
    const {setMessage} = useContext(ToastContext);
    const isSame = useMemo(() => isEqual(newEntry, oldEntry), [newEntry, oldEntry]);
    const isMissing = useMemo(() => !newEntry.name || !newEntry.icon, [newEntry]);

    return (
        <div className="flex gap-2">
            <Button
                variation={Button.Variation.ADD}
                onClick={onAddSubcategory}>
                <Plus size={ICON_SIZE}/>
                <label className="text-xs">
                    <Trans>Add Subcategory</Trans>
                </label>
            </Button>
            <Button
                variation={Button.Variation.SAVE}
                isDisabled={isSame || isMissing}
                onClick={async () => {
                    if (categoryId) {
                        await updateCategory({
                            id: categoryId,
                            name: newEntry.name,
                            icon: newEntry.icon,
                            isIncome: newEntry.isIncome,
                        });

                        setTooltipMessage(<Trans>Category added successfully</Trans>);
                    } else {
                        await createCategory({
                            name: newEntry.name,
                            icon: newEntry.icon,
                            isIncome: newEntry.isIncome,
                        });
                        setTooltipMessage(<Trans>Category updated successfully</Trans>);
                    }

                    onUpdate();
                }}>
                <FloppyDisk size={ICON_SIZE}/>
                <label className="text-xs">
                    <Trans>save</Trans>
                </label>
            </Button>
            <Button
                variation={Button.Variation.DELETE}
                onClick={() => {
                    if (!categoryId) {
                        return;
                    }

                    setMessage({
                        type: ToastTypes.DANGER,
                        text: <Trans>Are you sure you want to delete this category?</Trans>,
                        onConfirm: async () => {
                            await deleteCategory(categoryId);
                            setMessage({
                                type: ToastTypes.INFO,
                                text: <Trans>Deleted successfully</Trans>
                            });
                            onUpdate();
                        }
                    });
                }}>
                <Trash size={ICON_SIZE}/>
                <label className="text-xs">
                    <Trans>delete</Trans>
                </label>
            </Button>
        </div>
    )
}