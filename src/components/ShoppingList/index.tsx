"use client";

import { Card } from "@heroui/react";
import { Loading } from "./Loading";
import { useLoadShoppingList } from "@/hooks/useLoadShoppingList";
import { ItemsAccordion } from "./ItemsAccordion";

export const ShoppingList = () => {
    const { loading, error } = useLoadShoppingList();

    return (
        <Card className="w-full shadow-none rounded-none sm:shadow-surface sm:rounded-3xl text-gray-900">
            <Card.Content className="text-gray-900">
                {loading ? (
                    <Loading />
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <ItemsAccordion/>
                )}
            </Card.Content>
        </Card>
    );
}