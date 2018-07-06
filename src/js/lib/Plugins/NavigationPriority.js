/* =========================================================================
 * NAVIGATION PRIORITY
 * ========================================================================= */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var BasePlugin = Plugins.BasePlugin;
	var Dom = Sushi.Dom;
	var Dropdown = Plugins.Dropdown;
	var Events = Sushi.Events;
	var Util = Sushi.Util;

	var NavigationPriority = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		this.dropdownElement = Dom.getOne(this.options.dropdown);
		this.dropdownParentElement = Dom.getOne(this.options.dropdownParent);

		this.parseItems();
		this.createDropdownNav();
		this.populateDropdownNav();
		this.enable();
		this.update();
	};

	NavigationPriority.displayName = "NavigationPriority";

	NavigationPriority.DEFAULTS = {
		itemSelector: "> li",
		dropdownParent: "<li>",
		dropdown: "<ul class=\"o-dropdown\">",
		cloneEvents: false,
		hiddenClass: "_hidden",
	};

	/**
	 * Parses items and their priority from data-attributes
	 *
	 * @return {void}
	 */
	NavigationPriority.prototype.parseItems = function () {
		var orderedByPriority = [];
		var items = Dom.query(this.options.itemSelector, this.triggerElement);

		this.orderedItems = [];

		// Order items by received priority
		for (var i = 0; i < items.length; i++) {
			var itemElement = items[i];

			orderedByPriority[itemElement.dataset.priority] = {
				item: itemElement,
				dropdownItem: Dom.clone(itemElement, this.options.cloneEvents),
			};
		}

		// Reorder items by index-based priority so the array length does not exceed its
		// real, expected length
		for (var key in orderedByPriority) {
			this.orderedItems.push(orderedByPriority[key]);
		}
	};


	NavigationPriority.prototype.createDropdownNav = function () {
		this.dropdownParentElement.append(this.dropdownElement);
		this.triggerElement.append(this.dropdownParentElement);

		new Dropdown(this.dropdownParentElement, {
			preventClickOn: "> a",
		});
	};


	NavigationPriority.prototype.populateDropdownNav = function () {
		this.dropdownElement.innerHTML = "";

		for (var i in this.orderedItems) {
			this.dropdownElement.append(this.orderedItems[i].dropdownItem);
		}
	};


	NavigationPriority.prototype.update = function () {
		var triggerElementWidth = Util.Css.getWidth(this.triggerElement);

		// Remove dropdown parent hidden class so we can measure it
		this.dropdownParentElement.classList.remove(this.options.hiddenClass);

		var dropdownParentWidth = Math.max(0, Util.Css.getWidth(this.dropdownParentElement, true));
		var totalWidth = 0;
		var showDropdown = false;

		Util.forceRedraw(this.triggerElement);

		for (var i = 0; i < this.orderedItems.length; i++) {
			var itemElement = this.orderedItems[i].item;
			var dropdownItemElement = this.orderedItems[i].dropdownItem;

			itemElement.classList.remove(this.options.hiddenClass);
			dropdownItemElement.classList.remove(this.options.hiddenClass);

			totalWidth += Math.ceil(Util.Css.getWidth(itemElement, true));

			var fitsWithDropdown = (totalWidth < triggerElementWidth - dropdownParentWidth);
			var fitsWithoutDropdown = (totalWidth < triggerElementWidth);

			var isLastItem = (i === (this.orderedItems.length - 1));

			if (fitsWithoutDropdown || (fitsWithDropdown || (isLastItem && fitsWithoutDropdown))) {
				dropdownItemElement.classList.add(this.options.hiddenClass);
			}
			else {
				showDropdown = true;
				itemElement.classList.add(this.options.hiddenClass);
			}
		}

		if (!showDropdown) {
			this.dropdownParentElement.classList.add(this.options.hiddenClass);
		}
	};


	NavigationPriority.prototype.enable = function () {
		Events(window).on("NavigationPriority.resize", Sushi.Util.throttle(function () {
			this.update();
		}.bind(this)));
	};


	NavigationPriority.prototype.disable = function () {
		Events(window).off("NavigationPriority.resize");
	};


	Plugins.NavigationPriority = NavigationPriority;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
