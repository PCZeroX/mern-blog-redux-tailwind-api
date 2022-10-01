const express = require("express");
const {
	createNewPost,
	getAllPosts,
	updatePost,
	deletePost,
} = require("../controllers/posts.controller");
const verifyJWT = require("../middlewares/jwt/verifyJWT");

const postsRoutes = express.Router();

postsRoutes.get("/", getAllPosts);

postsRoutes.use(verifyJWT);
postsRoutes.post("/", createNewPost);
postsRoutes.put("/", updatePost);
postsRoutes.delete("/", deletePost);

module.exports = postsRoutes;
