const bcrypt = require("bcrypt");
const Post = require("../models/Post.model");
const User = require("../models/User.model");
const validateMongodbID = require("../utils/mongoose/validateMongodbID");

const getAllUsers = async (req, res) => {
	const users = await User.find().select("-password").lean();

	if (!users?.length) {
		return res.status(400).json({ message: "No users found" });
	}

	res.json(users);
};

const createNewUser = async (req, res) => {
	const { username, password, roles } = req.body;

	if (!username || !password)
		return res.status(400).json({ message: "All fields are required" });

	const duplicate = await User.findOne({ username })
		.collation({ locale: "en", strength: 2 })
		.lean()
		.exec();

	if (duplicate) return res.status(409).json({ message: "Duplicate username" });

	const hashedPassword = await bcrypt.hash(password, 10); // salt rounds

	const userObject =
		!Array.isArray(roles) || !roles.length
			? { username, password: hashedPassword }
			: {
					username,
					password: hashedPassword,
					roles,
			  };

	const user = await User.create(userObject);

	if (user) {
		res.status(201).json({ message: `New user ${username} created` });
	} else {
		res.status(400).json({ message: "Invalid user data received" });
	}
};

const updateUser = async (req, res) => {
	const { id, username, roles, active, password } = req.body;
	validateMongodbID(id);

	if (
		!id ||
		!username ||
		!Array.isArray(roles) ||
		!roles.length ||
		typeof active !== "boolean"
	) {
		return res
			.status(400)
			.json({ message: "All fields except password are required" });
	}

	const user = await User.findById(id).exec();

	if (!user) {
		return res.status(400).json({ message: "User not found" });
	}

	const duplicate = await User.findOne({ username })
		.collation({ locale: "en", strength: 2 })
		.lean()
		.exec();

	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({ message: "Duplicate username" });
	}

	user.username = username;
	user.roles = roles;
	user.active = active;

	if (password) {
		user.password = await bcrypt.hash(password, 10); // salt rounds
	}

	const updatedUser = await user.save();

	res.json({ message: `${updatedUser.username} updated` });
};

const deleteUser = async (req, res) => {
	const { id } = req.body;
	validateMongodbID(id);

	if (!id) return res.status(400).json({ message: "User ID Required" });

	const post = await Post.findOne({ user: id }).lean().exec();

	if (post) {
		return res.status(400).json({ message: "User has assigned posts" });
	}

	const user = await User.findById(id).exec();

	if (!user) {
		return res.status(400).json({ message: "User not found" });
	}

	const result = await user.deleteOne();

	const reply = `Username ${result.username} with ID ${result._id} was deleted`;

	res.json(reply);
};

module.exports = {
	getAllUsers,
	createNewUser,
	updateUser,
	deleteUser,
};
