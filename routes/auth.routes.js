const express = require("express");
const {
	refresh,
	login,
	logout,
} = require("../controllers/auth.controllers");
const loginLimiter = require("../middlewares/jwt/loginLimiter");

const authRoutes = express.Router();

authRoutes.get("/refresh", refresh);

authRoutes.post("/login", loginLimiter, login);
authRoutes.post("/logout", logout);

module.exports = authRoutes;
