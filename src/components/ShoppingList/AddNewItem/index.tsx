import { Button } from "@heroui/react"
import { FaPlus } from "react-icons/fa6";
import { AddNewItemModal } from "./AddNewItemModal";
import { useState } from "react";
import { useAddShoppingItem } from "@/hooks/useAddShoppingItem";

export const AddNewItem = () => {
    const { loading } = useAddShoppingItem();
    const [isOpen, setIsOpen] = useState(false);

    return (<>
        <Button 
        className="mt-5 h-10 border border-violet-700 bg-white px-4 text-violet-700 transition-colors duration-200 hover:bg-violet-50 focus-visible:ring-2 focus-visible:ring-violet-400/50"
        size="sm"
        onClick={() => setIsOpen(true)}
        aria-label="add new item"
        isDisabled={loading}
        >
            <span className="flex items-center gap-2 font-medium tracking-wide" title="Add new item">
                <FaPlus className="text-xs" />
                <span>Add new item</span>
            </span>
        </Button>
        <AddNewItemModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    )
}