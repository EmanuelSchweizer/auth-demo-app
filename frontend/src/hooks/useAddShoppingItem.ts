import { useShoppingItemsStore } from "@/store/shoppingItemsStore";
import { useState } from "react";
import { useServerAction } from "./useServerAction";
import { addShoppingItem } from "@/actions/addShoppingItem";
import { ShoppingItem } from "@/types";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

export const useAddShoppingItem = () => {
    const [loading, setLoading] = useState(false);
    const { addItem, updateItemOverTempId, removeItem, shoppingItems } = useShoppingItemsStore();
    const { Action: AddData } = useServerAction(addShoppingItem);

    const add = async (name: string) => {
        if (!name || name.trim() === "") return;

        setLoading(true);
        const tempId = `temp-${Date.now()}`;
        const newItem = { _id: tempId, name, bought: false, createdAt: new Date().toISOString() } as ShoppingItem;
        addItem(newItem);

        AddData({ name }).then((result) => {
            if (result.success && result.data) {
                updateItemOverTempId(tempId, { ...result.data });
                showSuccessToast("Successfully added item");
            } else {
                removeItem(tempId);
                showErrorToast("Ensure server is running and try again.");
            }
        }).finally(() => {
            setLoading(false);
        });
    };

    return {
        add,
        loading
    }
};