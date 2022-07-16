const express = require('express');
const fs = require('fs');
const warehouseData = require('../data/warehouses.json');
const inventoryData = require('../data/inventories.json');
const router = express.Router();

//get all inventory
router.get('/inventory', ((_req, res) => {
    res.status(200).json(inventories)
}))


module.exports = router;