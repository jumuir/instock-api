const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;
const warehouseRoutes = require('./routes/warehouses');
const inventoryRoutes = require('./routes/inventories');

app.use(cors());
app.use(express.json());

app.use('/warehouse', warehouseRoutes);
app.use('/inventory', inventoryRoutes);


app.listen(PORT, ()=> console.log(`Running up that hill on port ${PORT}`));



