/** @type {import("eslint").Linter.Config} */
module.exports = {
	root: true,
	extends: ["@discord-bot/eslint-config/web.js"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: true,
	},
};
