/* =========================================================================
 * Dropdown Menu
 *
 * @TODO implement resize so the dropdown doesn't overflow the page
 * ========================================================================= */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var Util = Sushi.Util;


	// Class definition
	// ---------------------------

	var Dropdown = function (target, options) {
		this.targetObject = $(target);

		this.options = $.extend(
			{},
			Dropdown.DEFAULTS,
			options,
			Util.getNamespaceProperties("dropdown", this.targetObject.data())
		);

		this.dropdownObject = this.targetObject.find("> .o-dropdown");

		this.isOpen = false;

		this.registerListeners();
		this.updatePositionClass();
		this.updateMaxHeight();
	};

	Dropdown.prototype.constructor = Dropdown;



	// Default Options
	// ---------------------------

	Dropdown.DEFAULTS = {
		triggerSelector: "",
		openEvent: "mouseenter",
		closeEvent: "mouseleave",
		preventClickOn: "",
		closeIntentionTimeout: 50,
		closeOnSelect: false,
		minHeight: null,
	};

	Dropdown.prototype.registerListeners = function () {
		var that = this;
		var triggerElement;

		if (this.options.triggerSelector === "") {
			triggerElement = this.targetObject;
		}
		else {
			triggerElement = this.targetObject.find(this.options.triggerSelector);
		}

		if (this.options.preventClickOn) {
			var preventClickOnElement;

			if (this.options.preventClickOn === "this") {
				preventClickOnElement = this.targetObject;
			}
			else {
				preventClickOnElement = this.targetObject.find(this.options.preventClickOn);
			}

			preventClickOnElement.on("click", function (event) {
				event.preventDefault();
			});
		}

		/*
		When the close event is a click you'd expect three things:
		[1] A click on the trigger element will close the dropdown
		[2] A click inside the dropdown won't close the dropdown
		[3] A click anywhere outside the trigger element and the dropdown will close the dropdown
		*/
		if (this.options.closeEvent === "click") {
			// [1] & [2]
			triggerElement
				.on("click.Dropdown.Sushi.closeCheck", function (event) {
					var eventTarget = $(event.target);
					var targetIsTrigger = (eventTarget === triggerElement);
					var targetIsChild = (eventTarget.closest(that.dropdownObject).length === 1);

					if (!that.options.closeOnSelect
						&& that.isOpen
						&& !targetIsTrigger
						&& targetIsChild) {
						event.stopImmediatePropagation();
					}
				});

			// [3]
			triggerElement.on("open.Dropdown.Sushi", function () {
				setTimeout(function () {
					$(document).one("click.Dropdown.Sushi", function (event) {
						if (that.isOpen
							&& ($(event.target).closest(that.targetObject).length === 0)) {
							that.closeContainer();
						}
					});
				}, 0);
			});
		}

		// if opening and closing events are the same, register only one event
		if (this.options.openEvent === this.options.closeEvent) {
			triggerElement
				.on(this.options.openEvent + ".Dropdown.Sushi", function () {
					that.toggleContainer();
				});
		}
		else {
			triggerElement
				.on(this.options.openEvent + ".Dropdown.Sushi", function () {
					that.openContainer();
				})
				.on(this.options.closeEvent + ".Dropdown.Sushi", function () {
					that.closeContainer();
				});
		}

		// $(window).on("resize.Dropdown.Sushi", Util.throttle(this.updateMaxHeight.bind(this)));
	};

	Dropdown.prototype.toggleContainer = function () {
		if (this.targetObject.hasClass("is-open")) {
			this.closeContainer();
		}
		else {
			this.openContainer();
		}
	};

	Dropdown.prototype.openContainer = function () {
		this.updatePositionClass();

		this.isOpen = true;

		this.targetObject.addClass("is-open");
		this.targetObject.data("closeIntention", false);
		this.targetObject.trigger("open");

		this.updateMaxHeight();
	};

	Dropdown.prototype.closeContainer = function () {
		var that = this;

		this.targetObject.data("closeIntention", true);

		setTimeout(function () {
			if (that.targetObject.data("closeIntention")) {
				that.isOpen = false;

				that.targetObject.removeClass("is-open");
				that.targetObject.trigger("close");
			}
		}, this.options.closeIntentionTimeout);
	};

	Dropdown.prototype.updatePositionClass = function () {
		this.dropdownObject.removeClass("o-dropdown--reverse");

		if (
			(this.dropdownObject.offset().left + this.dropdownObject.outerWidth(true))
			> $(window).width()
		) {
			this.dropdownObject.addClass("o-dropdown--reverse");
		}
	};

	/**
	 * Updates the max height of the dropdown element by taking into account the current viewport
	 * height
	 */
	Dropdown.prototype.updateMaxHeight = function () {
		setTimeout(function () {
			var topOffset = this.dropdownObject.offset().top;
			var pageHeight = $(window).height();
			var scroll = window.scrollY;
			var remainingHeight = Math.floor(pageHeight - Math.max(0, (topOffset - scroll)));
			var minHeight = this.options.minHeight;

			if (minHeight === null) {
				var dropdownComputedStyle = window.getComputedStyle(this.dropdownObject[0]);
				var dropdownVerticalPadding
					= parseInt(dropdownComputedStyle.getPropertyValue("padding-top"))
					+ parseInt(dropdownComputedStyle.getPropertyValue("padding-bottom"));
				var dropdownItems = this.dropdownObject.find("> li");
				var maxItems = Math.min(2, dropdownItems.length);

				minHeight = dropdownVerticalPadding;

				for (var i = 0; i < maxItems; i++) {
					var itemElement = dropdownItems[i];
					var itemComputedStyles = window.getComputedStyle(itemElement, "");
					var itemHeight = parseInt(itemComputedStyles.getPropertyValue("height"));
					var itemVerticalMargin
						= parseInt(itemComputedStyles.getPropertyValue("margin-top"))
						+ parseInt(itemComputedStyles.getPropertyValue("margin-bottom"));

					minHeight += itemHeight + itemVerticalMargin;
				}
			}

			this.dropdownObject.css("max-height", Math.max(remainingHeight, minHeight));
		}.bind(this), 0);
	};

	Plugins.Dropdown = Dropdown;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
