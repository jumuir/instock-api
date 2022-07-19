const express = require("express");
const fs = require("fs");
const warehouseData = require("../data/warehouses.json");
const inventoryData = require("../data/inventories.json");
const router = express.Router();

router.delete("/:warehouseId", (req, res) => {
  if (req.params) {
    console.log("Request sucessful");
  }
  //? deleting a warehouse

  const warehouseToDelete = warehouseData.findIndex(
    (warehouse) => warehouse.id === req.params.warehouseId
  );
  warehouseData.splice(warehouseToDelete, 1);
  // ? writing a new list of Warehouses to .json list
  fs.writeFile("./data/warehouses.json", JSON.stringify(warehouseData), (err) => {
    if (err) {
      console.log(err);
    }
  });

  // ? deleting corresponding inventory, that belongs to deleted warehouse

  for (let i = inventoryData.length - 1; i >= 0; i--) {
    if (inventoryData[i].warehouseID === req.params.warehouseId) {
      inventoryData.splice(i, 1);
    }
  }
  // ? writing a new list of Warehouses to .json list
  fs.writeFile("./data/inventories.json", JSON.stringify(inventoryData), (err) => {
    if (err) {
      console.log(err);
    }
  });

  const warehouseInvData = {
    warehouseData,
    inventoryData,
  };

  res.send(warehouseInvData).status(200);
});

module.exports = router;
