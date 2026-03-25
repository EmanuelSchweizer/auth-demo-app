import { ShoppingItem } from "@/types";
import { Input } from "@heroui/react";
import { useEffect, useState } from "react";
import { useUpdateShoppingItem } from "@/hooks/useUpdateShoppingItem";

interface Props {
    item: ShoppingItem;
}

export const ItemText = ({ item }: Props) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(item.name);
    const { update, loading } = useUpdateShoppingItem();

    useEffect(() => {
        if (editing || loading) {
            return;
        }
        update({ ...item, name: value });
    }, [editing, value]);

    return (<div
        title="Edit item name"
        onClick={() => { if (!loading) { setValue(item.name); setEditing(true); } }}
        onBlur={() => setEditing(false)}
        >
        {editing ?
            <Input
                placeholder="Enter item name"
                value={value}
                autoFocus
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setEditing(false);
                    }
                }}
                className={"border-0 p-1 focus-visible:ring-gray-200 rounded-md ring-gray-200"}
                aria-label="edit item name"
            />
            : <p className={`min-w-20 ${item.bought ? "line-through text-gray-500" : ""}`} aria-label="item name">
                {item.name}
            </p>}
    </div>);
}