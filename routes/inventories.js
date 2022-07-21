const express = require('express');
const fs = require('fs');
const warehouseData = require('../data/warehouses.json');
const inventoryData = require('../data/inventories.json');
const router = express.Router();
const { v4: uuid } = require('uuid');

// Import wrapper class for file system
const StorageWrapper = require("./../utility/storage-wrapper.js");
let storage = new StorageWrapper();

//get all inventory
router.get('/', (_req, res) => {
  res.status(200).json(inventoryData);
});

//get single inventory info
router.get('/:inventoryId', (req, res) => {
  const id = req.params.inventoryId;
  const selectedInventory = inventoryData.filter((inventory) => inventory.id === id);

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
    if (!req.body.warehouseID) {
      const matchingWarehouse = storage
        .getWarehouses()
        .filter((warehouse) => warehouse.id === req.body.warehouseID);
      const warehouseExists = matchingWarehouse === 1;

      if (!warehouseExists) {
        res.status(400);
        res.send({ message: "New inventory item must be associated with an existing warehouse." });
        return;
      }
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

router.delete("/:inventoryId", (req, res) => {
  if (!req.params) {
    res.send("Missing parameters of request").status(400);
  }
  //reading inventory file
  fs.readFile("./data/inventories.json", (err, data) => {
    if (err) {
      console.log("File read error");
      res.send("Cannot read file");
    }

    console.log("File read success");
  });

  //determine inventory index
  const itemToDelete = inventoryData.findIndex((invItem) => invItem.id === req.params.inventoryId);

  console.log(`Index of file to delete is: ${itemToDelete}`);

  //Deleting item from inventory

  inventoryData.splice(itemToDelete, 1);

  console.log(`File deleted:${JSON.stringify(inventoryData[itemToDelete])}`);

  fs.writeFile("./data/inventories.json", JSON.stringify(inventoryData), (err, data) => {
    if (err) {
      throw new Error(err);
    }
  });

  res.send(`Deleted item: ${JSON.stringify(inventoryData[itemToDelete])}`).status(200);
});

module.exports = router;
