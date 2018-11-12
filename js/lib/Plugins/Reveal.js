/* ==============================================================================================
 * ACCORDION
 *
 * "So many times I'm watching you"
 * ============================================================================================== */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var BasePlugin = Plugins.BasePlugin;
	var Dom = Sushi.Dom;
	var Events = Sushi.Events;
	var Util = Sushi.Util;

	var transitionEndEvent = Util.getTransitionEndEvent();

	var Reveal = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		this.isOpen = false;

		// Cache elements
		this.targetElement = Dom.get(this.options.target);
		this.contentElement = this.targetElement.querySelector(".c-reveal__content");

		var maxHeight = window.getComputedStyle(this.targetElement).maxHeight;
		var maxWidth = window.getComputedStyle(this.targetElement).maxWidth;

		this.autoHeight = (maxHeight !== "none") && (parseInt(maxHeight) === 0);
		this.autoWidth = (maxWidth !== "none") && (parseInt(maxWidth) === 0);

		this.registerListeners();
	};

	Reveal.displayName = "Reveal";

	Reveal.DEFAULTS = {
		preventDefault: true,
		rel: null,
	};

	Reveal.prototype = Object.create(BasePlugin.prototype);

	var proto = Reveal.prototype;

	proto.constructor = Reveal;

	proto.registerListeners = function () {
		Events(this.triggerElement).on("Reveal.click", function (event) {
			if (this.options.preventDefault) {
				event.preventDefault();
			}

			this.toggle();
		}.bind(this));
	};


	proto.prepare = function () {
		this.targetElement.classList.add("is-animating");

		if (this.autoHeight) {
			this.targetElement.style.maxHeight = this.contentElement.offsetHeight + "px";
		}

		if (this.autoWidth) {
			this.targetElement.style.maxWidth = this.contentElement.offsetWidth + "px";
		}

		if (this.triggerElement !== null) {
			this.triggerElement.blur();
		}
	};


	proto.removeAnimationClass = function () {
		Events(this.targetElement)
			.off("Reveal.removeAnimationClass." + transitionEndEvent)
			.one("Reveal.removeAnimationClass." + transitionEndEvent, function () {
				this.targetElement.classList.remove("is-animating");

				if (this.isOpen) {
					this.targetElement.style.maxHeight = "none";
					this.targetElement.style.maxWidth = "none";
				}
			}.bind(this));
	};


	proto.open = function () {
		if (this.isOpen) {
			return;
		}

		this.isOpen = true;

		if (this.triggerElement !== null) {
			this.triggerElement.classList.add("is-active");
		}

		this.targetElement.classList.add("is-active");

		this.prepare();

		Events(this.targetElement)
			.off("Reveal." + transitionEndEvent)
			.one("Reveal." + transitionEndEvent, function () {
				if (this.autoHeight) {
					this.targetElement.style.maxHeight = "none";
				}

				if (this.autoWidth) {
					this.targetElement.style.maxWidth = "none";
				}
			}.bind(this));

		this.removeAnimationClass();
	};


	proto.close = function () {
		if (!this.isOpen) {
			return;
		}

		this.isOpen = false;

		Events(this.targetElement).off("Reveal." + transitionEndEvent);

		if (this.triggerElement !== null) {
			this.triggerElement.classList.remove("is-active");
		}

		this.targetElement.classList.remove("is-active");

		this.prepare();

		Util.forceRepaint(this.targetElement);

		if (this.autoHeight) {
			this.targetElement.style.maxHeight = 0;
		}

		if (this.autoWidth) {
			this.targetElement.style.maxWidth = 0;
		}

		this.removeAnimationClass();
	};


	proto.toggle = function () {
		this.isOpen ? this.close() : this.open();
	};


	Plugins.Reveal = Reveal;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
