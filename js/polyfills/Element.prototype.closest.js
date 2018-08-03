/**
 * @url https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
 */
if (!Element.prototype.closest) {
	console.warn("Polyfilling Element.prototype.closest");

	Element.prototype.closest = function (selector) {
		var element = this;

		if (!document.documentElement.contains(element)) {
			return null;
		}

		while (element !== null && element.nodeType === 1) {
			if (element.matches(selector)) {
				return element;
			}

			element = element.parentElement || element.parentNode;
		}

		return null;
	};
}
