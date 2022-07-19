const express = require('express');
const fs = require('fs');
const warehouseData = require('../data/warehouses.json');
const inventoryData = require('../data/inventories.json');
const router = express.Router();
const { v4: uuid } = require('uuid');
const { validatePhone, validateEmail } = require('../middleware/validators');

// GET List of All warehouses
router.get("/", function (req, res) {
    res.status(201).json(warehouseData)
})

// GET single warehouse and inventory list
router.get("/:id", function (req, res) {
    
    const paramsID = req.params.id
    const singleWarehouse = warehouseData.find(warehouse => warehouse.id === paramsID)

    if (singleWarehouse === undefined){
        res.status(400).send("Warehouse does not exist")
    }  else {
        const warehouseInventory = inventoryData.filter(inventory => inventory.warehouseID === singleWarehouse.id)
        const warehouseInformation = {...singleWarehouse, warehouseInventory}
        res.status(200).send(warehouseInformation)
    }   
})

// POST new warehouse
router.post('/', (req, res) => {
    
    const { name, address, city, country, contact } = req.body;
    try {
        if(!validatePhone(contact.phone)) {
            throw "Phone number format is invalid. Numbers should be +1 (XXX) XXX-XXXX"
        }

        if (!validateEmail(contact.email)) {
            throw "Email format is invalid."
        }

        if (!name || !address || !city || !country || !contact || !contact.name || !contact.position || !contact.phone || !contact.email) {
            throw "All fields must be filled in."
        }
    } catch (err) {
        res.status(400).send(err);
        return;
    }

    const warehouseToAdd = {
        "id": uuid(),
        "name": name,
        "address": address,
        "city": city,
        "country": country,
        "contact": {
            "name": contact.name,
            "position": contact.position,
            "phone": contact.phone,
            "email": contact.email
        }
    }
    
    warehouseData.push(warehouseToAdd);
    
    fs.writeFile('./data/warehouses.json', JSON.stringify(warehouseData), (err) => {
        if (err) throw err;
    });

    res.status(201).send(warehouseToAdd);
});

// PUT edit warehouse
router.put('/:warehouseId', (req, res) => {
    
    const { name, address, city, country, contact } = req.body;
    
    try {
        if(!validatePhone(contact.phone)) {
            throw "Phone number format is invalid. Numbers should be +1 (XXX) XXX-XXXX"
        }

        if (!validateEmail(contact.email)) {
            throw "Email format is invalid."
        }

        if (!name || !address || !city || !country || !contact || !contact.name || !contact.position || !contact.phone || !contact.email) {
            throw "All fields must be filled in."
        }

        if (warehouseData.findIndex(wh => wh.id === req.params.warehouseId) === -1) {
           throw "That warehouse ID does not exist." 
        }
    } catch (err) {
        res.status(400).send(err);
        return;
    }

    const warehouseUpdate = {
        "id": req.params.warehouseId,
        "name": name,
        "address": address,
        "city": city,
        "country": country,
        "contact": {
            "name": contact.name,
            "position": contact.position,
            "phone": contact.phone,
            "email": contact.email
        }
    }
    
    const warehouseIndex = warehouseData.findIndex(wh => wh.id === req.params.warehouseId);
    warehouseData[warehouseIndex] = warehouseUpdate;
    
    fs.writeFile('./data/warehouses.json', JSON.stringify(warehouseData), (err) => {
        if (err) throw err;
    });

    res.send(warehouseUpdate);
});

module.exports = router;