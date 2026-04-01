const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
require('dotenv').config();

mongoose
    .connect(process.env.MONGOOSE_URL)
    .then(() => {
        app.listen(5000, () => {
            console.log("Database connected and server is running on http://localhost:5000");
        })
    })
    .catch((error) => {
        console.log("Error connecting to the database:", error);
    } )