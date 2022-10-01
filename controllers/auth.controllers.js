const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({ message: "All fields are required" });
	}

	const foundUser = await User.findOne({ username }).exec();

	if (!foundUser || !foundUser.active) {
		return res
			.status(401)
			.json({ message: "Incorrect or missing username" });
	}

	const match = await bcrypt.compare(
		password,
		foundUser.password
	);

	if (!match)
		return res
			.status(401)
			.json({ message: "Incorrect or missing password" });

	const accessToken = jwt.sign(
		{
			UserInfo: {
				username: foundUser.username,
				roles: foundUser.roles,
			},
		},
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: "5m" }
		// { expiresIn: "1m" }
		// { expiresIn: "10s" }
	);

	const refreshToken = jwt.sign(
		{ username: foundUser.username },
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: "7d" }
		// { expiresIn: "1d"	}
		// { expiresIn: "20s" }
	);

	// Create secure cookie with refresh token
	res.cookie("jwt", refreshToken, {
		httpOnly: true, //accessible only by web server
		secure: true, //https
		sameSite: "None", //cross-site cookie
		maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
	});

	// Send accessToken containing username and roles
	res.json({ accessToken });
};

const refresh = (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt)
		return res
			.status(401)
			.json({ message: "Unauthorized" });

	const refreshToken = cookies.jwt;

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, decoded) => {
			if (err)
				return res
					.status(403)
					.json({ message: "Forbidden" });

			const foundUser = await User.findOne({
				username: decoded.username,
			}).exec();

			if (!foundUser)
				return res
					.status(401)
					.json({ message: "Unauthorized" });

			const accessToken = jwt.sign(
				{
					UserInfo: {
						username: foundUser.username,
						roles: foundUser.roles,
					},
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: "5m" }
				// { expiresIn: "10s" }
			);

			res.json({ accessToken });
		}
	);
};

const logout = (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); //No content

	res.clearCookie("jwt", {
		httpOnly: true,
		sameSite: "None",
		secure: true,
	});

	res.json({ message: "Cookie cleared" });
};

module.exports = {
	login,
	refresh,
	logout,
};
