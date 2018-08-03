var Sushi;

(function (Sushi) {
	"use strict";

	var pluginStack = new Map();

	var parsePluggableElements = function (parentElement) {
		var pluginSelector = "[data-" + Sushi.pluginNamespace + "]";

		var pluggableElements = Array.prototype.slice.call(
			parentElement.querySelectorAll(pluginSelector)
		);

		if ((parentElement.dataset !== void 0) && (parentElement.dataset.sushi !== void 0)) {
			pluggableElements.push(parentElement);
		}

		for (var i in pluggableElements) {
			if (pluggableElements.hasOwnProperty(i)) {
				var element = pluggableElements[i];
				var pluginName = element.dataset[Sushi.pluginNamespace];

				if (Sushi.Plugins[pluginName] !== void 0) {
					new Sushi.Plugins[pluginName](element);
				}
				else {
					// eslint-disable-next-line no-console
					console.warn("Plugin " + pluginName + " doesn't exist");
				}
			}
		}
	};

	var parseActionableElements = function (parentElement) {
		var actionSelector = "[data-" + Sushi.actionNamespace + "]";

		var actionableElements = Array.prototype.slice.call(
			parentElement.querySelectorAll(actionSelector)
		);

		if (
			(parentElement.dataset !== void 0)
			&& (parentElement.dataset[Sushi.actionNamespace] !== void 0)) {
			actionableElements.push(parentElement);
		}

		for (var i in actionableElements) {
			if (actionableElements.hasOwnProperty(i)) {
				Sushi.Actions(actionableElements[i]);
			}
		}
	};

	Sushi.addPluginInstanceTo = function (element, instance) {
		if (element instanceof HTMLElement) {
			var instanceStack = (pluginStack.get(element) || new Map());

			instanceStack.set(instance.constructor, instance);

			pluginStack.set(element, instanceStack);
		}
	};

	Sushi.getPluginInstance = function (ofClass, inElement) {
		return (pluginStack.get(inElement) || new Map()).get(ofClass);
	};

	Sushi.getPluginStack = function () {
		return pluginStack;
	};

	Sushi.init = function (parentElement) {
		parsePluggableElements(parentElement);
		parseActionableElements(parentElement);
	};

	Sushi.pluginNamespace = "plugin";
	Sushi.actionNamespace = "action";
})(Sushi || (Sushi = {}));
