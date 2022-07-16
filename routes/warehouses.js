const express = require('express');
const fs = require('fs');
const warehouseData = require('../data/warehouses.json');
const inventoryData = require('../data/inventories.json');
const router = express.Router();
const { v4: uuid } = require('uuid');
const { validatePhone, validateEmail } = require('../middleware/validators');

// POST new warehouse
router.post('/', (req, res) => {
    
    const { name, address, city, country, contact } = req.body;
    try {
        if(!validatePhone(contact.phone)) {
            throw "Phone number format is invalid. Numbers should be +1 (XXX) XXX-XXXX"
        }

        if (!validateEmail(contact.email)) {
            throw "Email number format is invalid."
        }

        if (!name || !address || !city || !country || !contact || !contact.name || !contact.position || !contact.phone || !contact.email) {
            throw "All fields must be filled in."
        }
    } catch (err) {
        res.status(400).send(err);
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

module.exports = router;