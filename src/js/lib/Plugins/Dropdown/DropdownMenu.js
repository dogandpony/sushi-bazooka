/* =========================================================================
 * Dropdown Menu
 *
 * TODO: Add a scrollbar to the dropdown if it doesn't fit on the screen
 * ========================================================================= */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var Dropdown = Sushi.Plugins.Dropdown;

	var DropdownMenu = function (menu, options) {
		this.menu = menu;

		this.options = $.extend(
			{},
			DropdownMenu.DEFAULTS,
			options,
			Sushi.Util.getNamespaceProperties("dropdownMenu", this.menu.data())
		);

		this.registerListeners();
	};

	DropdownMenu.DEFAULTS = {
		dropdownParentSelector: ".has-subnav",
		triggerSelector: "",
		openEvent: "mouseenter",
		closeEvent: "mouseleave",
		preventClickOn: "",
	};

	DropdownMenu.prototype.registerListeners = function () {
		var that = this;

		var dropdownContainers = this.menu;

		if (this.options.dropdownParentSelector) {
			dropdownContainers = this.menu.find(this.options.dropdownParentSelector);
		}

		dropdownContainers.each(function () {
			new Dropdown($(this), {
				triggerSelector: that.options.triggerSelector,
				openEvent: that.options.openEvent,
				closeEvent: that.options.closeEvent,
				preventClickOn: that.options.preventClickOn,
			});
		});
	};

	Plugins.DropdownMenu = DropdownMenu;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
