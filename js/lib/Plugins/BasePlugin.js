/* ==============================================================================================
 * BASE PLUGIN CLASS
 * ============================================================================================== */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var Events = Sushi.Events;
	var Util = Sushi.Util;

	var BasePlugin = function (triggerElement, options) {
		if (Sushi.getPluginInstance(this.constructor, triggerElement)) {
			return;
		}

		var constructorName = Util.firstCharacterToLowerCase(this.constructor.displayName);

		Sushi.addPluginInstanceTo(triggerElement, this);

		this.triggerElement = triggerElement;

		this.id = Util.uniqueId();

		this.options = Object.assign(
			{},
			this.constructor.DEFAULTS,
			triggerElement.dataset,
			Util.getNamespaceProperties(constructorName, triggerElement.dataset),
			options
		);
	};

	BasePlugin.DEFAULTS = {};

	BasePlugin.displayName = "BasePlugin";

	var proto = BasePlugin.prototype;

	proto.createListener = function (targets, types, fn, one) {
		if (fn == null) {
			return null;
		}

		one = one || false;

		return Events(targets)[one ? "one" : "on"](this.getNamespaceEventTypes(types), fn);
	};

	proto.destroyListener = function (targets, types, fn) {
		return Events(targets).off(this.getNamespaceEventTypes(types), fn);
	};

	proto.getNamespaceEventTypes = function (types) {
		types = (typeof types === "string") ? types.split(" ") : types;

		var namespaceTypes = [];

		types.forEach(function (type) {
			namespaceTypes.push([ this.id, this.constructor.displayName, type ].join("."));
		}.bind(this));

		return namespaceTypes;
	};

	Plugins.BasePlugin = BasePlugin;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
