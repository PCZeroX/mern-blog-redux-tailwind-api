const express = require("express");
const path = require("path");

const rootRoutes = express.Router();

rootRoutes.get("^/$|/index(.html)?", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = rootRoutes;
