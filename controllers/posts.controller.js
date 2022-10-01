const Post = require("../models/Post.model");
const User = require("../models/User.model");

const getAllPosts = async (req, res) => {
	const posts = await Post.find().lean();

	if (!posts?.length) {
		return res.status(400).json({ message: "No posts found" });
	}

	const postsWithUser = await Promise.all(
		posts.map(async (post) => {
			const user = await User.findById(post.user).lean().exec();
			return { ...post, username: user.username };
		})
	);

	res.json(postsWithUser);
};

const createNewPost = async (req, res) => {
	const { user, title, description } = req.body;

	if (!user || !title || !description) {
		return res.status(400).json({ message: "All fields are required" });
	}

	const duplicate = await Post.findOne({ title })
		.collation({ locale: "en", strength: 2 })
		.lean()
		.exec();

	if (duplicate) {
		return res.status(409).json({ message: "Duplicate post title" });
	}

	const post = await Post.create({ user, title, description });

	if (post) {
		return res.status(201).json({ message: "New post created" });
	} else {
		return res.status(400).json({ message: "Invalid post data received" });
	}
};

const updatePost = async (req, res) => {
	const { id, user, title, description, isCompleted } = req.body;

	if (
		!id ||
		!user ||
		!title ||
		!description ||
		typeof isCompleted !== "boolean"
	) {
		return res.status(400).json({ message: "All fields are required" });
	}

	const post = await Post.findById(id).exec();

	if (!post) {
		return res.status(400).json({ message: "Note not found" });
	}

	const duplicate = await Post.findOne({ title })
		.collation({ locale: "en", strength: 2 })
		.lean()
		.exec();

	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({ message: "Duplicate post title" });
	}

	post.user = user;
	post.title = title;
	post.description = description;
	post.isCompleted = isCompleted;

	const updatedPost = await post.save();

	res.json({ message: `${updatedPost.title} updated` });
};

const deletePost = async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ message: "Post ID required" });
	}

	const post = await Post.findById(id).exec();

	if (!post) {
		return res.status(400).json({ message: "Post not found" });
	}

	const result = await post.deleteOne();

	const reply = `Post '${result.title}' with ID ${result._id} was deleted`;

	res.json({ message: reply });
};

module.exports = {
	getAllPosts,
	createNewPost,
	updatePost,
	deletePost,
};
