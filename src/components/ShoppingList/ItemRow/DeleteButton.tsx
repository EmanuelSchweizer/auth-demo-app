import { useDeleteShoppingItem } from "@/hooks/useDeleteShoppingItem";
import { Button, Popover, Label } from "@heroui/react";
import { FiTrash2 } from "react-icons/fi";

interface Props {
    id: string;
}

const buttonClassName =
    "text-gray-500 hover:text-red-600 hover:bg-red-600/15 transition-colors duration-200";

const trashIcon = <FiTrash2 size={22} />;

export const DeleteButton = ({ id }: Props) => {
    const { deleteItem, loading } = useDeleteShoppingItem();
    return (
        <Popover>
            <Button
                size="sm"
                variant="ghost"
                className={buttonClassName}
                aria-label="Delete item"
                isIconOnly
            >
                <div title="Delete item">{trashIcon}</div>
            </Button>
            <Popover.Content placement="bottom">
                <Button
                    size="sm"
                    variant="ghost"
                    isDisabled={loading}
                    onClick={() => deleteItem(id)}
                    className={buttonClassName}
                    aria-label="Confirm delete item"
                >
                    <span className="flex items-center space-x-2 cursor-pointer" title="Confirm delete item">
                        {trashIcon}
                        <Label className="cursor-pointer">Delete</Label>
                    </span>
                </Button>
            </Popover.Content>
        </Popover>
    );
};
