const mongoose = require("mongoose");

const dbConnect = async () => {
	try {
		await mongoose.connect(process.env.DATABASE_URI);
	} catch (err) {
		console.log(err);
	}
};

module.exports = dbConnect;
