const express = require('express');
const fs = require('fs');
const warehouseData = require('../data/warehouses.json');
const inventoryData = require('../data/inventories.json');
const router = express.Router();

// API to GET List of All warehouses
router.get("/", function (req, res) {
    res.status(201).json(warehouseData)
})


module.exports = router;