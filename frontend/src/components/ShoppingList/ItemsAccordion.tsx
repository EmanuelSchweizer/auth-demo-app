import { FaChevronDown, FaList, FaCheck } from "react-icons/fa6";
import { Accordion } from "@heroui/react";
import { useShoppingItemsStore } from "@/store/shoppingItemsStore";
import { ItemRow } from "./ItemRow";
import { AddNewItem } from "./AddNewItem";

export function ItemsAccordion() {
    const { shoppingItems } = useShoppingItemsStore();

    const items = [
        {
            id: "to-buy",
            items: shoppingItems.filter(item => !item.bought),
            icon: < FaList />,
            title: "To buy",
        },
        {
            id: "already-bought",
            items: shoppingItems.filter(item => item.bought),
            icon: <FaCheck />,
            title: "Already bought",
        },
    ];

    return (
        <Accordion allowsMultipleExpanded className="w-full" defaultExpandedKeys={["to-buy"]}>
            {items.map((item) => (
                <Accordion.Item id={item.id} key={item.id}>
                    <Accordion.Heading>
                        <Accordion.Trigger>
                            {item.icon ? (
                                <span className="mr-3 size-4 shrink-0 text-muted">{item.icon}</span>
                            ) : null}
                            <p className="font-semibold">{item.title}</p>
                            <Accordion.Indicator>
                                <FaChevronDown />
                            </Accordion.Indicator>
                        </Accordion.Trigger>
                    </Accordion.Heading>
                    <Accordion.Panel>
                        <Accordion.Body>
                           <ul>
                                {item.items.sort((a, b) => a.createdAt.localeCompare(b.createdAt)).map((shoppingItem) => (
                                    <ItemRow key={shoppingItem._id} item={shoppingItem} />
                                ))}
                            </ul>
                            {item.items.length === 0 && <p className="text-muted">No items in this category</p>}
                            {item.id === "to-buy" && <AddNewItem />}
                        </Accordion.Body>
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}