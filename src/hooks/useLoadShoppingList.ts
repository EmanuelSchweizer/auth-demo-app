import { useEffect, useState } from "react";
import { useServerAction } from "./useServerAction";
import { getShoppingItems } from "@/actions/getShoppingItems";
import { useShoppingItemsStore } from "@/store/shoppingItemsStore";
import { showErrorToast } from "@/utils/toast";

export const useLoadShoppingList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>("");
    const { Action: GetData } = useServerAction(getShoppingItems);
    const { setShoppingItems } = useShoppingItemsStore();

    useEffect(() => {
        setError("");
        setLoading(true);
        GetData().then((result) => {
            if (result.success) {
                setShoppingItems(result.data);
            } else {
                setShoppingItems([]);
                showErrorToast("Ensure server is running and try again.");
                setError(result.error);
            }
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    return { loading, error };
}