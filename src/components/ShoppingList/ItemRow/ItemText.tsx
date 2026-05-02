import { ShoppingItem } from "@/types";

interface Props {
    item: ShoppingItem;
}

export const ItemText = ({ item }: Props) => {

    return (<div
        title="Item name"
    >
        {<p className={`min-w-20 ${item.bought ? "line-through text-gray-500" : ""}`} aria-label="item name">
            {item.name}
        </p>}
    </div>);
}