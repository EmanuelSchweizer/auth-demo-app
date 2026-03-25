import { ShoppingItem } from "@/types"
import { useState } from "react";
import { useShoppingItemsStore } from "@/store/shoppingItemsStore";
import { useServerAction } from "./useServerAction";
import { updateShoppingItem } from "@/actions/updateShoppingItem";
import { showErrorToast, showSuccessToast, showWarningToast } from "@/utils/toast";

const isInvalidName = (name: string) => name.trim() === "" || name.length > 100;

export const useUpdateShoppingItem = () => {
    const [loading, setLoading] = useState(false);
    const { updateItem, shoppingItems } = useShoppingItemsStore();
    const { Action: updateData } = useServerAction(updateShoppingItem);

    const update = async (updatedItem: ShoppingItem) => {
        setLoading(true);

        const oldItem = shoppingItems.find(item => item._id === updatedItem._id);
        if (!oldItem) {
            setLoading(false);
            return;
        }

        const isUnchanged = oldItem.bought === updatedItem.bought && oldItem.name === updatedItem.name;
        if (isUnchanged) {
            setLoading(false);
            return;
        }

        if (isInvalidName(updatedItem.name)) {
            showWarningToast("Validation failed. Please ensure the item name is not empty and does not exceed 100 characters.");
            setLoading(false);
            return;
        }

        updateItem(updatedItem);
        try {
            const result = await updateData({
                id: updatedItem._id,
                bought: updatedItem.bought,
                name: updatedItem.name,
            });

            if (result.success) {
                showSuccessToast("Successfully updated item");
            } else {
                updateItem(oldItem);
                showErrorToast("Ensure server is running and try again.");
            }
        } catch {
            updateItem(oldItem);
            showErrorToast("Ensure server is running and try again.");
        } finally {
            setLoading(false);
        }
    }

    return { update, loading };

}