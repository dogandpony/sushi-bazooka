/* =========================================================================
 * Dropdown Menu
 *
 * TODO: Add a scrollbar to the dropdown if it doesn't fit on the screen
 * ========================================================================= */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var BasePlugin = Plugins.BasePlugin;
	var Dropdown = Sushi.Plugins.Dropdown;

	var DropdownMenu = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		this.registerListeners();
	};

	DropdownMenu.displayName = "DropdownMenu";

	DropdownMenu.DEFAULTS = {
		dropdownParentSelector: ".has-subnav",
		triggerSelector: "",
		openEvent: "mouseenter",
		closeEvent: "mouseleave",
		preventClickOn: "",
	};

	DropdownMenu.prototype = Object.create(BasePlugin.prototype);

	var proto = DropdownMenu.prototype;

	proto.constructor = DropdownMenu;

	proto.registerListeners = function () {
		var dropdownContainers = this.triggerElement;

		if (this.options.dropdownParentSelector) {
			dropdownContainers = this.triggerElement.querySelectorAll(
				this.options.dropdownParentSelector
			);
		}

		for (var i = 0; i < dropdownContainers.length; i++) {
			new Dropdown(dropdownContainers[i], this.options);
		}
	};

	Plugins.DropdownMenu = DropdownMenu;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
