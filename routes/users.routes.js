const express = require("express");
const {
	getAllUsers,
	createNewUser,
	updateUser,
	deleteUser,
} = require("../controllers/users.controller");
const verifyJWT = require("../middlewares/jwt/verifyJWT");

const usersRoutes = express.Router();

usersRoutes.use(verifyJWT);

usersRoutes.get("/", getAllUsers);
usersRoutes.post("/", createNewUser);
usersRoutes.put("/", updateUser);
usersRoutes.delete("/", deleteUser);

module.exports = usersRoutes;
