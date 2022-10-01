/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./views/**/*.{html,js}"],
	theme: {
		container: {
			center: true,
		},
		extend: {
			backgroundImage: {
				"hero-background": "url('../img/background.jpg')",
			},
			fontFamily: {
				poppins: "'Poppins', sans-serif",
				roboto: "'Roboto', sans-serif",
				raleway: "'Raleway', sans-serif",
				lato: "'Lato', sans-serif",
			},
			animation: {
				"spin-slow": "spin 20s linear infinite",
				"pulse-slow": "pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			},
		},
	},
	plugins: [],
};
