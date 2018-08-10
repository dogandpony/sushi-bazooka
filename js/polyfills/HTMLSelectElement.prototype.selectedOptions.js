/**
 * Please note this polyfill generates a NodeList object instead of HTMLCollection
 */
if (!HTMLSelectElement.prototype.hasOwnProperty("selectedOptions")) {
	// eslint-disable-next-line no-console
	console.warn("Polyfilling HTMLSelectElement.prototype.selectedOptions");

	Object.defineProperty(HTMLSelectElement.prototype, "selectedOptions", {
		get: function () {
			return this.querySelectorAll(":checked");
		},
		enumerable: true,
		configurable: true,
	});
}
