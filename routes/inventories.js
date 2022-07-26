const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');

// Import wrapper for file system
const storage = require("./../utility/storage-wrapper.js");

//get all inventory
router.get('/', (_req, res) => {
    res.status(200).json(storage.getInventories());
});

//get single inventory info
router.get('/:inventoryId', (req, res) => {
    const id = req.params.inventoryId;
    const selectedInventory = storage.getInventories().filter((inventory) => inventory.id === id);

    if (selectedInventory) {
        res.status(200).send(selectedInventory);
    } else {
        res.status(400).json(`Inventory # ${id} does not exist`);
    }
});

/**
 * POST route for adding an inventory item to the inventory list.
 */
router.post('/', function (req, res) {
    if (req.body) {
        // Only proceed further if the warehouse ID is valid, and the warehouse exists.
        if (req.body?.warehouseID) {
            const matchingWarehouse = storage
                .getWarehouses()
                .filter((warehouse) => warehouse.id === req.body.warehouseID);
            const warehouseExists = matchingWarehouse.length === 1;

            if (!warehouseExists) {
                res.status(400);
                res.send({ message: "Provided warehouse ID is invalid." });
                return;
            }
        } else {
            res.status(400);
            res.send({ message: "New inventory item must be associated with an existing warehouse." });
            return;
        }

        // Since the associated warehouse is valid, exact the body fields and create a new inventory object.
        const { itemName, description, category, status, quantity } = { ...req.body };
        const associatedWarehouse = storage
            .getWarehouses()
            .filter((warehouse) => warehouse.id === req.body.warehouseID)[0];

        if (!(itemName && description && category && status && quantity)) {
            res.status(400);
            res.send({ message: "New inventory object missing required field(s)." });
            return;
        }

        const newInventoryEntry = {
            id: uuid(),
            warehouseID: associatedWarehouse.id,
            warehouseName: associatedWarehouse.name,
            itemName: itemName,
            description: description,
            category: category,
            status: status,
            quantity: quantity,
        };

        // Add the new inventory object to the list of inventories.
        const newInventoryList = storage.getInventories();
        newInventoryList.push(newInventoryEntry);
        storage.setInventories(newInventoryList);

        res.status(200);
        res.send(newInventoryEntry);
    } else {
        res.status(400);
        res.send({ message: "Body cannot be empty" });
    }
});

/**
 * PUT route for updating an existing inventory item in the inventory list.
 */
router.put('/:inventoryId', (req, res) => {

    if (req.body) {
        if (!req.params?.inventoryId) {
            res.status(400);
            res.send({ message: "Inventory ID required" });
        }

        const matchingInventory = storage
            .getInventories()
            .filter((inventory) => inventory.id === req.params.inventoryId);
        const inventoryExists = matchingInventory.length === 1;

        if (!inventoryExists) {
            res.status(400);
            res.send({ message: "Cannot update non-existent inventory item." });
            return;
        }

        const { warehouseID, itemName, description, category, status, quantity } = { ...req.body };
        const associatedWarehouse = storage
            .getWarehouses()
            .filter((warehouse) => warehouse.id === warehouseID)[0];

        if (!associatedWarehouse) {
            res.status(400);
            res.send({ message: "Provided warehouse ID is invalid." });
            return;
        }

        if (!(itemName && description && category && status && (quantity >= 0))) {
            res.status(400);
            res.send({ message: "New inventory object missing required field(s)." });
            return;
        }

        // At this point, we've done all the reasonable validation checks, hence we can start updating
        const updatedInventories = storage.getInventories();

        const targetInventoryIndex = updatedInventories.findIndex( inventory => inventory.id === req.params.inventoryId);
        const targetInventoryItem = updatedInventories[targetInventoryIndex];
        
        targetInventoryItem['warehouseID'] = warehouseID;
        targetInventoryItem['warehouseName'] = associatedWarehouse.name;
        targetInventoryItem['itemName'] = itemName;
        targetInventoryItem['description'] = description;
        targetInventoryItem['category'] = category;
        targetInventoryItem['status'] = status;
        targetInventoryItem['quantity'] = quantity;

        storage.setInventories(updatedInventories);

        res.status(200);
        res.send(targetInventoryItem);

    } else {
        res.status(400);
        res.send({ message: "Body cannot be empty" });
    }
});

router.delete("/:inventoryId", (req, res) => {
    if (!req.params) {
        res.send("Missing parameters of request").status(400);
        return;
    }

    // Determine inventory index
    const itemToDeleteIndex = storage.getInventories().findIndex( (invItem) => invItem.id === req.params.inventoryId);

    if (itemToDeleteIndex === -1) {
        res.status(400);
        res.send({message: "Invalid inventory ID."});
        return;
    }

    // Deleting item from inventory
    const updatedInventories = storage.getInventories();
    const deletedItem = updatedInventories.splice(itemToDeleteIndex, 1);

    storage.setInventories(updatedInventories);

    res.status(200);
    res.send(
        {
            message: "Succesfully deleted inventory item",
            deleteInventory: deletedItem
        }
    );
});

module.exports = router;
