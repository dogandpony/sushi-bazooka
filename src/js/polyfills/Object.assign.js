/**
 * @url https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
if (typeof Object.assign !== "function") {
	// eslint-disable-next-line no-console
	console.warn("Polyfilling Object.assign");

	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, "assign", {
		// eslint-disable-next-line require-jsdoc, strict
		value: function assign(target) { // .length of function is 2
			if (target == null) { // TypeError if undefined or null
				throw new TypeError("Cannot convert undefined or null to object");
			}

			var to = Object(target);

			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];

				if (nextSource != null) { // Skip over if undefined or null
					for (var nextKey in nextSource) {
						// Avoid bugs when hasOwnProperty is shadowed
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}

			return to;
		},
		writable: true,
		configurable: true,
	});
}
