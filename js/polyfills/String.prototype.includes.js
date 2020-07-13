/**
 * @url https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
 */
if (String.prototype.includes === void 0) {
	// eslint-disable-next-line no-console
	console.warn("Polyfilling String.prototype.includes");

	Object.defineProperty(String.prototype, "includes", {
		configurable: true,
		value: function (search, start) {
			if (typeof start !== "number") {
				start = 0;
			}

			if (start + search.length > this.length) {
				return false;
			}
			else {
				return (this.indexOf(search, start) !== -1);
			}
		},
	});
}
