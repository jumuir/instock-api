const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');
const { validatePhone, validateEmail } = require('../middleware/validators');

// Import wrapper for file system
const storage = require("./../utility/storage-wrapper.js");

// GET List of All warehouses
router.get('/', function (req, res) {
    res.status(201).json(storage.getWarehouses());
});

// GET single warehouse and inventory list
router.get("/:id", function (req, res) {
    
    const paramsID = req.params.id
    const singleWarehouse = storage.getWarehouses().find(warehouse => warehouse.id === paramsID)

    if (singleWarehouse === undefined){
        res.status(400).send("Warehouse does not exist")
    }  else {
        const warehouseInventory = storage.getInventories().filter(inventory => inventory.warehouseID === singleWarehouse.id)
        const warehouseInformation = {...singleWarehouse, warehouseInventory}
        res.status(200).send(warehouseInformation)
    }   
})

// POST new warehouse
router.post('/', (req, res) => {
    const { name, address, city, country, contact } = req.body;
    try {
        if (!validatePhone(contact.phone)) {
            throw "Phone number format is invalid. Numbers should be +1 (XXX) XXX-XXXX";
        }

        if (!validateEmail(contact.email)) {
            throw "Email format is invalid.";
        }

        if (
            !name ||
            !address ||
            !city ||
            !country ||
            !contact ||
            !contact.name ||
            !contact.position ||
            !contact.phone ||
            !contact.email
        ) {
            throw "All fields must be filled in.";
        }
    } catch (err) {
        res.status(400).send(err);
        return;
    }

    const warehouseToAdd = {
        id: uuid(),
        name: name,
        address: address,
        city: city,
        country: country,
        contact: {
            name: contact.name,
            position: contact.position,
            phone: contact.phone,
            email: contact.email,
        },
    };

    const newWarehouseList = storage.getWarehouses();
    newWarehouseList.push(warehouseToAdd);
    storage.setWarehouses(newWarehouseList);

    res.status(201).send(warehouseToAdd);
});

// PUT edit warehouse
router.put('/:warehouseId', (req, res) => {
    const { name, address, city, country, contact } = req.body;

    try {
        if (!validatePhone(contact.phone)) {
            throw "Phone number format is invalid. Numbers should be +1 (XXX) XXX-XXXX";
        }

        if (!validateEmail(contact.email)) {
            throw "Email format is invalid.";
        }

        if (
            !name ||
            !address ||
            !city ||
            !country ||
            !contact ||
            !contact.name ||
            !contact.position ||
            !contact.phone ||
            !contact.email
        ) {
            throw "All fields must be filled in.";
        }

        if (storage.getWarehouses().findIndex((wh) => wh.id === req.params.warehouseId) === -1) {
            throw "That warehouse ID does not exist.";
        }
    } catch (err) {
        res.status(400).send(err);
        return;
    }

    const warehouseUpdate = {
        id: req.params.warehouseId,
        name: name,
        address: address,
        city: city,
        country: country,
        contact: {
            name: contact.name,
            position: contact.position,
            phone: contact.phone,
            email: contact.email,
        },
    };


    const warehouseIndex = storage.getWarehouses().findIndex((wh) => wh.id === req.params.warehouseId);
    
    const updatedWarehouseList = storage.getWarehouses();
    updatedWarehouseList[warehouseIndex] = warehouseUpdate;
    storage.setWarehouses(updatedWarehouseList);

    // Aside from the warehouse, we also have to update the warehouse name for 
    // every affected inventory.
    const updatedInventories = storage.getInventories();
    updatedInventories.map( inventory => {
        if (inventory.warehouseID === warehouseUpdate.id) {
            inventory.warehouseName = warehouseUpdate.name;
        }
        return inventory;
    })
    storage.setInventories(updatedInventories);

    res.send(warehouseUpdate);
});

router.delete('/:warehouseId', (req, res) => {
    //? deleting a warehouse

    const warehouseToDelete = storage.getWarehouses().findIndex(
        (warehouse) => warehouse.id === req.params.warehouseId
    );
    const updatedWarehouseList = storage.getWarehouses();
    const deletedWarehouse = updatedWarehouseList.splice(warehouseToDelete, 1);
    storage.setWarehouses(updatedWarehouseList);
    
    // ? deleting corresponding inventory, that belongs to deleted warehouse
    const updatedInventories = storage.getInventories();
    const deletedInventories = [];
    for (let i = updatedInventories.length - 1; i >= 0; i--) {
        if (updatedInventories[i].warehouseID === req.params.warehouseId) {
            const deletedInventory = updatedInventories.splice(i, 1);
            deletedInventories.push(deletedInventory);
        }
    }
    storage.setInventories(updatedInventories);

    const deletedData = { deletedWarehouse, deletedInventories };
    res.send(deletedData).status(200);
});


module.exports = router;
