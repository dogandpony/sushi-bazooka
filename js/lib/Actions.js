/* ==============================================================================================
 * ACTIONS
 * ============================================================================================== */

var Sushi;

(function (Sushi, root) {
	"use strict";

	var Events = Sushi.Events;
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
					Events(element).off(eventType, controller);
					Events(element).on(eventType, controller);
				}
			}
		}
	};

	Actions.parseController = function (controllerReference) {
		var controller = null;

		var reference = controllerReference.split(".");
		var controllerTree = root;
		var controllerTreeString = "";

		for (var i = 0; i < reference.length; i++) {
			controller = controllerTree[reference[i]];
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
