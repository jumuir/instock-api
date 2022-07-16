const express = require("express");
const fs = require("fs");
const warehouseData = require("../data/warehouses.json");
const warehouseTest = require("../data/wareHouseTest.json");
const inventoryData = require("../data/inventories.json");
const inventoryTest = require("../data/inventories_copy.json");
const router = express.Router();

router.delete("/:warehouseId", (req, res) => {
  // console.log(req.params.warehouseId);
  if (req.params) {
    console.log("Request sucessful");
  }
  //? deleting a warehouse
  const newWarehouseList = warehouseTest.filter(
    (warehouse) => warehouse.id !== req.params.warehouseId
  );

  console.log(newWarehouseList);

  fs.writeFile("./data/wareHouseTest.json", JSON.stringify(newWarehouseList), (err) => {
    // console.log(err);
  });

  // // ? deleting corresponding inventory, that belongs to deleted warehouse

  // const newInventory = inventoryTest.filter((inv) => inv.warehouseID !== req.params.warehouseId);
  // console.log(newInventory);

  // fs.writeFile("./data/inventories_copy.json", JSON.stringify(newInventory), (err) => {
  //   // throw new Error(err);
  // });

  // const warehouseInvData = {
  //   newWarehouseList,
  //   // newInventory,
  // };

  res.send(newWarehouseList);
});

module.exports = router;
