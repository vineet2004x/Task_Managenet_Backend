
require('dotenv').config();
const express = require('express');
const { sequelize } = require('./src/config/database');

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Unable to connect to database:", error);
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();
