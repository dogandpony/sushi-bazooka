/* =========================================================================
 * Dropdown Menu
 *
 * @TODO implement resize so the dropdown doesn't overflow the page
 * ========================================================================= */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var BasePlugin = Plugins.BasePlugin;
	var Dom = Sushi.Dom;
	var Events = Sushi.Events;
	var Util = Sushi.Util;
	var Css = Util.Css;

	var Dropdown = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		this.dropdownElement = Dom.query("> .o-dropdown", this.triggerElement);

		this.isOpen = false;
		this.hasCloseIntention = false;

		this.registerListeners();
		this.updatePositionClass();
		this.updateMaxHeight();
	};

	Dropdown.displayName = "Dropdown";

	Dropdown.DEFAULTS = {
		triggerSelector: "",
		triggerEvent: "mouseenter mouseleave",
		preventClickOn: "",
		closeOnSelect: false,
		minHeight: null,
	};

	Dropdown.prototype = Object.create(BasePlugin.prototype);

	var proto = Dropdown.prototype;

	proto.constructor = Dropdown;

	proto.registerListeners = function () {
		if (this.options.preventClickOn) {
			var preventClickOnElement;

			if (this.options.preventClickOn === "this") {
				preventClickOnElement = this.targetElement;
			}
			else {
				preventClickOnElement = Dom.queryAll(this.options.preventClickOn, this.targetElement);
			}

			Events(preventClickOnElement).on("click", function (event) {
				event.preventDefault();
			});
		}

		/*
		When the close event is a click you'd expect three things:
		[1] A click on the trigger element will close the dropdown
		[2] A click inside the dropdown won't close the dropdown
		[3] A click anywhere outside the trigger element and the dropdown will close the dropdown
		*/
		if (this.options.triggerEvent === "click") {
			// [1] & [2]
			Events(this.triggerElement)
				.on("Dropdown.click", function (event) {
					var targetIsTrigger = (event.target === this.triggerElement);
					var targetIsChild = this.dropdownElement.contains(event.target);

					if (
						!this.options.closeOnSelect
						&& !targetIsTrigger
						&& targetIsChild
					) {
						event.stopImmediatePropagation();
					}
				}.bind(this));

			// [3]
			Events(this.triggerElement).on("Dropdown.open", function (event) {
				setTimeout(function () {
					Events(document).one("Dropdown.click", function (event) {
						if (this.isOpen && (!this.triggerElement.contains(event.target))) {
							this.close();
						}
					}.bind(this));
				}.bind(this), 0);
			}.bind(this));
		}

		Events(this.triggerElement).on(this.options.triggerEvent, function () {
			this.toggle();
		}.bind(this));
	};

	proto.toggle = function () {
		if (this.isOpen) {
			this.close();
		}
		else {
			this.open();
		}
	};

	proto.open = function () {
		if (!this.isOpen) {
			this.isOpen = true;

			this.updatePositionClass();

			this.triggerElement.classList.add("is-open");

			Events(this.triggerElement).trigger("open");

			this.updateMaxHeight();
		}
	};

	proto.close = function () {
		if (this.isOpen) {
			this.isOpen = false;

			this.triggerElement.classList.remove("is-open");

			Events(this.triggerElement).trigger("close");
		}
	};

	proto.updatePositionClass = function () {
		var leftOffset = Css.getOffset(this.dropdownElement).left;
		var outerWidth = Css.getWidth(this.dropdownElement, true);

		this.dropdownElement.classList.remove("o-dropdown--reverse");

		if ((leftOffset + outerWidth) > window.offsetWidth) {
			this.dropdownElement.classList.add("o-dropdown--reverse");
		}
	};

	/**
	 * Updates the max height of the dropdown element by taking into account the current viewport
	 * height
	 */
	proto.updateMaxHeight = function () {
		setTimeout(function () {
			var topOffset = Css.getOffset(this.dropdownElement).top;
			var pageHeight = window.offsetHeight;
			var scroll = window.scrollY;
			var remainingHeight = Math.floor(pageHeight - Math.max(0, (topOffset - scroll)));
			var minHeight = this.options.minHeight;

			if (minHeight === null) {
				var dropdownComputedStyle = window.getComputedStyle(this.dropdownElement);
				var dropdownVerticalPadding = parseInt(dropdownComputedStyle.paddingTop)
					+ parseInt(dropdownComputedStyle.paddingBottom);
				var dropdownItems = Dom.queryAll("> li", this.dropdownElement);
				var maxItems = Math.min(2, dropdownItems.length);

				minHeight = dropdownVerticalPadding;

				for (var i = 0; i < maxItems; i++) {
					var itemElement = dropdownItems[i];
					var itemComputedStyles = window.getComputedStyle(itemElement, "");
					var itemHeight = parseInt(itemComputedStyles.height);
					var itemVerticalMargin = parseInt(itemComputedStyles.marginTop)
						+ parseInt(itemComputedStyles.marginBottom);

					minHeight += itemHeight + itemVerticalMargin;
				}
			}

			this.dropdownElement.style.maxHeight = (Math.max(remainingHeight, minHeight) + "px");
		}.bind(this), 0);
	};

	Plugins.Dropdown = Dropdown;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
