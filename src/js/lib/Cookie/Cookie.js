/* =====================================================================
 * Cookie
 * ===================================================================== */

var Sushi;

(function (Sushi) {
	"use strict";

	var Cookie = function () {};

	Cookie.create = function (name, value, days, path) {
		var expires = "";

		path = path || "/";

		if (days) {
			var date = new Date();

			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toUTCString();
		}

		document.cookie = name + "=" + (value || "") + expires + "; path=" + path;
	};

	Cookie.get = function (name) {
		var nameEQ = name + "=";
		var cookieArray = document.cookie.split(";");

		for (var i = 0; i < cookieArray.length; i++) {
			var cookieString = cookieArray[i];

			while (cookieString.charAt(0) === " ") {
				cookieString = cookieString.substring(1, cookieString.length);
			}

			if (cookieString.indexOf(nameEQ) === 0) {
				return cookieString.substring(nameEQ.length, cookieString.length);
			}
		}

		return null;
	};

	Cookie.delete = function (name) {
		document.cookie = name + "=; Max-Age=-99999999;";
	};

	Sushi.Cookie = Cookie;
})(Sushi || (Sushi = {}));
