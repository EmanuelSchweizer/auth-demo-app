import { useShoppingItemsStore } from "@/store/shoppingItemsStore";
import { useState } from "react";
import { useServerAction } from "./useServerAction";
import { deleteShoppingItem } from "@/actions/deleteShoppingItem";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

export const useDeleteShoppingItem = () => {
    const { removeItem, shoppingItems, addItem } = useShoppingItemsStore();
    const [loading, setLoading] = useState(false);
    const { Action: DeleteData } = useServerAction(deleteShoppingItem);

    const deleteItem = async (id: string) => {
        if (!id || id === "") return;
        const oldItem = shoppingItems.find(item => item._id === id);
        if (!oldItem) return;

        setLoading(true);
        removeItem(id);
        DeleteData({ id }).then((result) => {
            if (result.success) {
                showSuccessToast("Successfully deleted item");
            } else {
                showErrorToast("Ensure server is running and try again.");
                addItem(oldItem);
            }
        }).finally(() => {
            setLoading(false);
        });
    };

    return {
        deleteItem,
        loading
    }
}