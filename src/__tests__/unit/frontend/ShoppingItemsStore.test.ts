import '@testing-library/jest-dom';
import { useShoppingItemsStore } from '@/store/shoppingItemsStore';


describe('ShoppingItemsStore', () => {
    beforeEach(() => {
        useShoppingItemsStore.setState({ shoppingItems: [] });
    });

    it('should add a new item to the store', () => {
        const newItem = { _id: '1', name: 'Item 1', bought: false, createdAt: new Date().toISOString() };
        useShoppingItemsStore.getState().addItem(newItem);
        const items = useShoppingItemsStore.getState().shoppingItems;
        expect(items).toContainEqual(newItem);
    });

    it('should remove an item from the store', () => {
        const itemToRemove = { _id: '2', name: 'Item 2', bought: false, createdAt: new Date().toISOString()};
        useShoppingItemsStore.setState({ shoppingItems: [itemToRemove] });
        useShoppingItemsStore.getState().removeItem('2');
        const items = useShoppingItemsStore.getState().shoppingItems;
        expect(items).not.toContainEqual(itemToRemove);
    });

    it('should update an existing item in the store', () => {
        const existingItem = { _id: '3', name: 'Item 3', bought: false, createdAt: new Date().toISOString() };
        useShoppingItemsStore.setState({ shoppingItems: [existingItem] });
        const updatedItem = { _id: '3', name: 'Updated Item 3', bought: true, createdAt: new Date().toISOString() };
        useShoppingItemsStore.getState().updateItem(updatedItem);
        const items = useShoppingItemsStore.getState().shoppingItems;
        expect(items).toContainEqual(updatedItem);
    });

    it('should update an item over a temporary ID in the store', () => {
        const tempId = 'temp-4';
        const tempItem = { _id: tempId, name: 'Temp Item 4', bought: false, createdAt: new Date().toISOString() };
        useShoppingItemsStore.setState({ shoppingItems: [tempItem] });
        const newItem = { _id: '4', name: 'New Item 4', bought: false, createdAt: new Date().toISOString() };
        useShoppingItemsStore.getState().updateItemOverTempId(tempId, newItem);
        const items = useShoppingItemsStore.getState().shoppingItems;
        expect(items).toContainEqual(newItem);
        expect(items).not.toContainEqual(tempItem);
    });
});