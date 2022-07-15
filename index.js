const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;
const routes = require('./routes/warehouses');
 
app.use(cors());
app.use(express.json());

app.use('/', routes);


app.listen(PORT, ()=> console.log(`Running with scissors on port ${PORT}`));