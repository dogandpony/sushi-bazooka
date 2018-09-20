/* ==============================================================================================
 * MUTATION OBSERVER (beta)
 *
 * This replaces contentChange events by retaining the same functionality. Still in beta, use
 * with caution.
 * ============================================================================================== */

var Sushi;

(function (Sushi) {
	"use strict";

	Sushi.init(document.body);

	// Create an observer instance linked to the callback function
	var observer = new MutationObserver(function (mutationsList) {
		for (var i = 0; i < mutationsList.length; i++) {
			var mutation = mutationsList[i];

			if ((mutation.type === "childList") && mutation.addedNodes.length > 0) {
				for (var j = 0; j < mutation.addedNodes.length; j++) {
					var node = mutation.addedNodes[j];

					Sushi.init(node);
				}
			}
		}
	});

	// Start observing the target node for configured mutations
	observer.observe(document.body, {
		attributes: true,
		childList: true,
		subtree: true,
	});
})(Sushi || (Sushi = {}));
