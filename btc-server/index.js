const express = require('express');
require('dotenv').config();
const app = express();
const apis = require('./api');
const bodyParser = require('body-parser');

app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.send("Hii Mom!");
})

app.use('/api', apis);

app.listen(3000, () => {
    console.log("Server started in port 3000");
})