if (Function.prototype.name === undefined) {
	console.warn("Polyfilling Function.prototype.name");

	// eslint-disable-next-line no-extend-native
	Object.defineProperty(Function.prototype, "name", {
		get: function () {
			var funcNameRegex = /function\s([^(]+)\(/;
			var results = funcNameRegex.exec((this).toString());

			return (results && results.length > 1) ? results[1].trim() : "";
		},
		set: function (value) {},
	});
}
