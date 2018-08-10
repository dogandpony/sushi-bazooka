/* ==============================================================================================
 * CONTENT CHANGE HELPER
 * ============================================================================================== */

var Sushi;

(function (Sushi) {
	"use strict";

	Sushi.Events(document).on("contentchange", function (event) {
		Sushi.init(event.target);
	});

	Sushi.Events(document).trigger("contentchange");
})(Sushi || (Sushi = {}));
