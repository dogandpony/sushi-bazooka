/**
 * @url https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
 */
if (!Element.prototype.matches) {
	// eslint-disable-next-line no-console
	console.warn("Polyfilling Element.prototype.matches");

	Element.prototype.matches = Element.prototype.msMatchesSelector
		|| Element.prototype.webkitMatchesSelector;
}
