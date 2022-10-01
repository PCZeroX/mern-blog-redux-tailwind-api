// const express = require("express");
const postsRoutes = require("./posts.routes");
const rootRoutes = require("./root.routes");
const usersRoutes = require("./users.routes");
const authRoutes = require("./auth.routes");

const routes = (app) => {
	// const router = express.Router();
	// app.use("/api", router);

	app.use("/", rootRoutes);
	app.use("/users", usersRoutes);
	app.use("/posts", postsRoutes);
	app.use("/auth", authRoutes);
};

module.exports = routes;
