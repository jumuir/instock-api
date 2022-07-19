const express = require('express');
const fs = require('fs');
const warehouseData = require('../data/warehouses.json');
const inventoryData = require('../data/inventories.json');
const router = express.Router();

//get all inventory
router.get('/', ((_req, res) => {
    res.status(200).json(inventoryData)
}))

//get single inventory info
router.get('/:inventoryId', ((req, res) => {

    const id = req.params.inventoryId
    const selectedInventory = inventoryData.filter(inventory => inventory.id === id)

    if (selectedInventory) {
        res.status(200).send(selectedInventory)
    }
    else {
        res.status(400).json(`Inventory # ${id} does not exist`)
    }
}))

module.exports = router;