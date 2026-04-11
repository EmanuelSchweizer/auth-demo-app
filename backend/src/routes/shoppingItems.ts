import { Router } from 'express';
import mongoose from 'mongoose';

import { ShoppingItemModel } from '../models/ShoppingItem.js';
import type { ShoppingItemDocument } from '../models/ShoppingItem.js';
import { resolveRequestUser } from '../utils/resolveRequestUser.js';

const shoppingItemsRouter = Router();

//GET /items
shoppingItemsRouter.get('/items', async (req, res) => {
    try {
        const requestUser = await resolveRequestUser(req, res);
        if (!requestUser) {
            return;
        }

        const itemsData: ShoppingItemDocument[] = await ShoppingItemModel.find({ user: requestUser._id }).sort({ createdAt: -1 });
        res.json(itemsData);
    } catch (error) {
        res.status(500).json({ message: 'Shopping items could not be loaded.', error });
    }
});

//POST /items
shoppingItemsRouter.post('/items', async (req, res) => {
    const { name } = req.body as { name?: string };
    const trimmedName = name?.trim();

    if (!trimmedName) {
        res.status(400).json({ message: 'name is required.' });
        return;
    }

    try {
        const requestUser = await resolveRequestUser(req, res);
        if (!requestUser) {
            return;
        }

        const createdItem: ShoppingItemDocument = await ShoppingItemModel.create({
            name: trimmedName,
            bought: false,
            user: requestUser._id
        });

        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: 'Shopping item could not be created.', error });
    }
});

//PUT /items/:id
shoppingItemsRouter.put('/items/:id', async (req, res) => {
    const { id } = req.params;
    const { bought } = req.body as { bought?: boolean };

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid item id.' });
        return;
    }

    if (typeof bought !== 'boolean') {
        res.status(400).json({ message: 'bought must be a boolean.' });
        return;
    }

    try {
        const requestUser = await resolveRequestUser(req, res);
        if (!requestUser) {
            return;
        }

        const updatedItem: ShoppingItemDocument | null = await ShoppingItemModel.findOneAndUpdate(
            { _id: id, user: requestUser._id },
            { bought },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            res.status(404).json({ message: 'Shopping item not found.' });
            return;
        }

        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: 'Shopping item could not be updated.', error });
    }
});

//DELETE /items/:id
shoppingItemsRouter.delete('/items/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid item id.' });
        return;
    }

    try {
        const requestUser = await resolveRequestUser(req, res);
        if (!requestUser) {
            return;
        }

        const deletedItem: ShoppingItemDocument | null = await ShoppingItemModel.findOneAndDelete({ _id: id, user: requestUser._id });

        if (!deletedItem) {
            res.status(404).json({ message: 'Shopping item not found.' });
            return;
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Shopping item could not be deleted.', error });
    }
});

export default shoppingItemsRouter;