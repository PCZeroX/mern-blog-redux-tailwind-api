const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const postSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			default:
				"https://cdn.pixabay.com/photo/2020/10/25/09/23/seagull-5683637_960_720.jpg",
		},
		isCompleted: {
			type: Boolean,
			default: false,
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

postSchema.plugin(AutoIncrement, {
	inc_field: "ticket",
	id: "ticketNums",
	start_seq: 100,
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
