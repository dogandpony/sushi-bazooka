// var Sushi;

// (function (Sushi) {
// 	"use strict";

// 	var Util = Sushi.Util;

// 	Sushi.init = function (parentElement) {
// 		var pluggableElements = parentElement.querySelectorAll("[data-sushi]");

// 		for (var i in pluggableElements) {
// 			if (pluggableElements.hasOwnProperty(i)) {
// 				var element = pluggableElements[i];
// 				var pluginName = element.dataset.sushi;
// 				var pluginNameCamelCase = Util.firstCharacterToLowerCase(pluginName);

// 				element._sushi || (element._sushi = {});

// 				if (element._sushi[pluginNameCamelCase] === void 0) {
// 					element._sushi[pluginNameCamelCase] =
// 						new Sushi.Plugins[pluginName](element);
// 				}
// 			}
// 		}
// 	};

// 	Sushi.init(document);
// })(Sushi || (Sushi = {}));
