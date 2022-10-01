const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			lowercase: true,
			required: true,
			// required: [true, "Username is required"],
		},
		// email: {
		// 	type: String,
		// 	lowercase: true,
		// 	required: true,
		// 	// required: [true, "Email is required"],
		// },
		password: {
			type: String,
			required: true,
			// required: [true, "Password is required"],
		},
		roles: {
			type: [String],
			default: ["User"],
			enum: ["Admin", "Manager", "Editor", "Blogger", "User"],
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

module.exports = User;
