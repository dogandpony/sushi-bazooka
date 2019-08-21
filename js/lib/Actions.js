/* ==============================================================================================
 * ACTIONS
 * ============================================================================================== */

(function (Sushi, root) {
	"use strict";

	var Util = Sushi.Util;

	var Actions = function (element, actions) {
		var eventConfig = Util.merge(
			{},
			Util.getNamespaceProperties(Sushi.actionNamespace, element.dataset),
			actions
		);

		Object.keys(eventConfig).forEach(function (eventType) {
			var eventHandler = function (event) {
				var controller = Actions.parseController(eventConfig[eventType]);

				return controller.call(this, event);
			};

			Sushi.Events(element).off("actions." + eventType);
			Sushi.Events(element).on("actions." + eventType, eventHandler);
		});
	};

	Actions.parseController = function (controllerReference) {
		var reference = controllerReference.split(".");
		var controller = root;

		for (var i = 0; i < reference.length; i++) {
			controller = controller[reference[i]];
		}

		return controller;
	};

	Sushi.Actions = Actions;
})(window.Sushi || (window.Sushi = {}), window);
