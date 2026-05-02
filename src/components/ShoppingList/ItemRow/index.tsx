import { ShoppingItem } from "@/types";
import { BoughtCheckBox } from "./BoughtCheckBox";
import { ItemText } from "./ItemText";
import { DeleteButton } from "./DeleteButton";
import { CreatedTime } from "./CreatedTime";

interface Props {
    item: ShoppingItem;
}

export const ItemRow = ({ item }: Props) => {
    return (
        <div className="flex items-center justify-between p-2 border-b border-gray-200 h-10">
            <div className="flex items-center space-x-2">
                <BoughtCheckBox item={item} />
                <ItemText item={item} />
            </div>
            <div className="flex items-center space-x-2">
                <CreatedTime timestamp={item.createdAt} />
                <DeleteButton id={item._id} />
            </div>
        </div>
    );
}