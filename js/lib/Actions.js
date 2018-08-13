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
				var controllers = parseControllers(eventConfig[eventType]);

				for (var i = 0; i < controllers.length; i++) {
					var controller = controllers[i];

					Events(element).off(eventType, controller);
					Events(element).on(eventType, controller);
				}
			}
		}
	};

	var parseControllers = function (controllerReferences) {
		var controllers = [];

		if (typeof controllerReferences === "string") {
			controllerReferences = [controllerReferences];
		}

		for (var i = 0; i < controllerReferences.length; i++) {
			var reference = controllerReferences[i].split(".");
			var controllerTree = root;

			for (var j = 0; j < reference.length; j++) {
				var index = reference[j];

				controllerTree = controllerTree[index];
			}

			controllers.push(controllerTree);
		}

		return controllers;
	};

	Sushi.Actions = Actions;
})(Sushi || (Sushi = {}), this);
