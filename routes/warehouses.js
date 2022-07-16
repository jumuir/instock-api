const express = require('express');
const fs = require('fs');
const warehouseData = require('../data/warehouses.json');
const inventoryData = require('../data/inventories.json');
const router = express.Router();

// API to GET List of All warehouses
router.get("/", function (_req, res) {
    res.status(201).json(warehouseData)
})

// API to GET List of Single warehouse
router.get("/:id", function (req, res) {
    const warehouseID = req.params.id
    const singleWarehouse = warehouseData.find((warehouse)=>{
    return warehouse.id === warehouseID
    })    
    res.status(201).json(singleWarehouse)
})

module.exports = router;