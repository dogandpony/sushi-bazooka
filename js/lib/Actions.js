/* ==============================================================================================
 * ACTIONS
 * ============================================================================================== */

var Sushi;

(function (Sushi, root) {
	"use strict";

	var Util = Sushi.Util;

	var Actions = function (element, actions) {
		var eventConfig = Util.merge(
			{},
			Util.getNamespaceProperties(Sushi.actionNamespace, element.dataset),
			actions
		);

		for (var eventType in eventConfig) {
			if (eventConfig.hasOwnProperty(eventType)) {
				var controller = Actions.parseController(eventConfig[eventType]);

				if (controller !== null) {
					Sushi.Events(element).off(eventType, controller);
					Sushi.Events(element).on(eventType, controller);
				}
			}
		}
	};

	Actions.parseController = function (controllerReference) {
		var reference = controllerReference.split(".");
		var controller = root;
		var controllerTreeString = "";

		for (var i = 0; i < reference.length; i++) {
			controller = controller[reference[i]];
			controllerTreeString += "." + reference[i];

			if (controller == null) {
				// eslint-disable-next-line no-console
				console.warn(
					"Function " + controllerTreeString.replace(/^\./, "") + " doesn't exist."
				);

				return null;
			}
		}

		return controller;
	};

	Sushi.Actions = Actions;
})(Sushi || (Sushi = {}), this);
