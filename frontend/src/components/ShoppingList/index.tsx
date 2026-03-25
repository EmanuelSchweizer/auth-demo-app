"use client";

import { useServerAction } from "@/hooks/useServerAction";
import { Card } from "@heroui/react";
import { useEffect, useState } from "react";
import { getShoppingItems } from "@/actions/getShoppingItems";
import { Loading } from "./Loading";

export const ShoppingList = () => {
    const [loading, setLoading] = useState(true);
    const { Action: GetData } = useServerAction(getShoppingItems);

    useEffect(() => {
        setLoading
        GetData().then((result) => {
            if (result.success) {
                console.log(result.data);
            } else {
                console.error(result.error);
            }
        }).finally(() => {
            setLoading(false);
        });
    }, []);


    return (
        <Card className="w-full shadow-none rounded-none sm:shadow-surface sm:rounded-3xl text-gray-800">
            <Card.Header>
                <h1 className="text-xl font-bold mb-4">My Shopping List</h1>
            </Card.Header>
            <Card.Content className="text-gray-500">
                {loading ? (
                    <Loading />
                ) : (
                    <p>Data loaded. Check console for details.</p>
                )}
            </Card.Content>
        </Card>
    );
}