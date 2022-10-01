require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const corsOptions = require("./config/cors/corsOptions");
const dbConnect = require("./config/db/dbConnect");

const routes = require("./routes/routes");

const errorHandler = require("./middlewares/error/errorHandler");
const { logger } = require("./middlewares/error/logger");

const app = express();
const PORT = process.env.PORT;

console.log(process.env.NODE_ENV);

dbConnect();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use(morgan("dev"));

app.use(
	"/",
	express.static(path.join(__dirname, "public"))
);

routes(app);

app.all("*", (req, res) => {
	res.status(404);

	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ message: "404 Not Found" });
	} else {
		res.type("txt").send("404 Not Found");
	}
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
	console.log("👋 Connecting to DB 📃");
	app.listen(PORT, () => {
		console.log(
			`🚀 Server running on port http://localhost:${PORT}`
		);
	});
});
