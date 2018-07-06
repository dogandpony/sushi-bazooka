/* =====================================================================
 * Sushi's Base Plugin class
 * ===================================================================== */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var Util = Sushi.Util;

	var BasePlugin = function (triggerElement, options) {
		var constructorName = Util.firstCharacterToLowerCase(this.constructor.displayName);

		Sushi.addPluginInstanceTo(triggerElement, this);

		this.triggerElement = triggerElement;

		this.id = Util.uniqueId();

		this.options = Object.assign(
			{},
			this.constructor.DEFAULTS,
			Util.getNamespaceProperties(constructorName, triggerElement.dataset),
			options
		);
	};

	BasePlugin.DEFAULTS = {};

	Plugins.BasePlugin = BasePlugin;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
