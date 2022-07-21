const fs = require('fs');

/** @class This is a wrapper interface for interacting with the data.
 * The main purpose being to abstract away any dealing directly with 
 * filesystem by other code needing to interact with data. */
class StorageWrapper {

    /**
     * Class constructor. When instantiated, read the respective file from storage,
     * and assign defined callbacks to be run after completion of reading.
     */
    constructor() {
        fs.readFile('./data/inventories.json', this._handleInventories);
        fs.readFile('./data/warehouses.json', this._handleWarehouses);
    }

    /**
     * Callback for defining behaviours after reading the inventory JSON.
     */
    _handleInventories = (err, data) => {
        if (err) {
            throw err
        }

        // If no errors, update the private variable to contain data read from file.
        this._inventories = JSON.parse(data);
    }

    /**
     * Callback for defining behaviours after reading the warehouse JSON.
     */
     _handleWarehouses = (err, data) => {
        if (err) {
            throw err
        }

        // If no errors, update the private variable to contain data read from file.
        this._warehouses = JSON.parse(data);
    }

    /**
     * Getter for "inventories" variable.
     */
    getInventories() {
        return this._inventories;
    }

    /**
     * Getter for "warehouses" variable.
     */
    getWarehouses() {
        return this._warehouses;
    }

    /**
     * Set both the in memory and local storage inventories to the new value.
     */
    setInventories(value) {

        // Update the current variable in memory to the new value
        this._inventories = value;

        // Save the new variable to disk to replace existing.
        fs.writeFile("./data/inventories.json", JSON.stringify(this._inventories), (err) => {
            if (err)
                throw err
        });
    }
}

module.exports = StorageWrapper;