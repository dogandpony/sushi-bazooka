/* ==============================================================================================
 * CHASER
 * ============================================================================================== */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var BasePlugin = Plugins.BasePlugin;

	var Css = Sushi.Util.Css;
	var Dom = Sushi.Dom;
	var Events = Sushi.Events;
	var Util = Sushi.Util;

	var Chaser = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		this.isEnabled = false;

		this.placeholder = Dom.get(this.options.placeholder); // cache placeholder object

		this.triggerElement.insertAdjacentElement("afterend", this.placeholder);
		this.triggerElement.classList.add("o-chaser");

		this.proxyEvents();

		if (this.options.inverted) {
			this.options.triggerPosition = "bottom";
		}

		this.scrollTrigger = this.getScrollTriggerInstance();

		this.parseLimit();
		this.enable();
		this.update();
	};

	Chaser.displayName = "Chaser";

	Chaser.DEFAULTS = Object.assign({}, Plugins.ScrollTrigger.DEFAULTS, {
		placeholder: "<i class=\"o-chaserPlaceholder\">",
		updatePlaceholderHeight: true,
		updateThreshold: 30,
		offset: 0, // Number or Function
		limit: null, // null, Number or HTMLElement
		usePlaceholderWidth: false,
		inverted: false,
	});

	Chaser.prototype = Object.create(BasePlugin.prototype);

	var proto = Chaser.prototype;

	proto.constructor = Chaser;

	proto.enable = function () {
		if (this.isEnabled) {
			return;
		}

		this.isEnabled = true;

		this.scrollTrigger.enable();

		Events(window).on(
			this.id + ".Chaser.resize " + this.id + ".Chaser.scroll",
			Sushi.Util.throttle(this.update.bind(this), this.options.updateThreshold)
		);
	};

	proto.disable = function () {
		if (!this.isEnabled) {
			return;
		}

		this.isEnabled = false;

		this.scrollTrigger.disable();

		Events(window).off(this.id + ".Chaser.resize " + this.id + ".Chaser.scroll");
	};

	proto.proxyEvents = function () {
		var eventBefore = this.options.eventBefore;
		var eventAfter = this.options.eventAfter;

		this.options.eventBefore = function (scrollTrigger) {
			this.updateStylesBefore(scrollTrigger.getOffset());

			this.runEvent(eventBefore);
		}.bind(this);

		this.options.eventAfter = function (scrollTrigger) {
			this.updateStylesAfter(scrollTrigger.getOffset());

			this.runEvent(eventAfter);
		}.bind(this);
	};

	proto.updateStylesBefore = function (offset) {
		if (this.options.inverted) {
			this.triggerElement.style.bottom = offset + "px";
			this.triggerElement.classList.add("is-chasing");
		}
		else {
			this.triggerElement.style.top = "auto";
			this.triggerElement.classList.remove("is-chasing");
		}
	};

	proto.updateStylesAfter = function (offset) {
		if (this.options.inverted) {
			this.triggerElement.style.bottom = "auto";
			this.triggerElement.classList.remove("is-chasing");
		}
		else {
			this.triggerElement.style.top = (-1 * offset) + "px";
			this.triggerElement.classList.add("is-chasing");
		}

	};

	proto.runEvent = function (fn) {
		if (typeof fn === "string") {
			fn = Sushi.Actions.parseController(fn);
		}

		if (typeof fn === "function") {
			fn(this);
		}
	};

	proto.parseLimit = function () {
		if (this.options.limit == null) {
			return;
		}

		var number = Number(this.options.limit);

		// Return if it's a number (incl. strings of numbers)
		if (!isNaN(number)) {
			this.options.limit = number;

			return;
		}

		var limitElement = Dom.get(this.options.limit);

		if (limitElement === null) {
			return;
		}

		if (this.options.inverted) {
			this.options.limit = function () {
				return Util.Css.getOffset(limitElement).top
					+ limitElement.clientHeight
					+ this.placeholder.clientHeight
					- window.innerHeight;
			}.bind(this);
		}
		else {
			this.options.limit = function () {
				return Util.Css.getOffset(limitElement).top - this.placeholder.clientHeight;
			}.bind(this);
		}
	};

	proto.update = function () {
		if (this.options.updatePlaceholderHeight) {
			this.updatePlaceholderHeight();
		}

		this.updateLimit();

		if (this.options.usePlaceholderWidth) {
			this.updateMaxWidth();
		}
	};

	proto.updateLimit = function () {
		if (this.options.limit == null) {
			return;
		}

		var limitPosition = this.options.limit;

		if (typeof this.options.limit === "function") {
			limitPosition = this.options.limit();
		}

		limitPosition += this.scrollTrigger.getOffset();

		var isLimited = (this.options.inverted
			? (limitPosition > window.pageYOffset)
			: (limitPosition < window.pageYOffset)
		);

		if (isLimited) {
			this.triggerElement.classList.add("is-limited");
			this.triggerElement.style.transform = "translateY(" + limitPosition + "px)";
		}
		else {
			this.triggerElement.classList.remove("is-limited");
			this.triggerElement.style.transform = "";
		}
	};

	proto.updatePlaceholderHeight = function () {
		this.placeholder.style.height = Css.getHeight(this.triggerElement, true) + "px";
	};

	proto.updateMaxWidth = function () {
		this.triggerElement.style.maxWidth = window.getComputedStyle(this.placeholder).width;
	};

	proto.getScrollTriggerInstance = function () {
		var options = {};

		for (var optionKey in Plugins.ScrollTrigger.DEFAULTS) {
			if (Plugins.ScrollTrigger.DEFAULTS.hasOwnProperty(optionKey)) {
				options[optionKey] = this.options[optionKey];
			}
		}

		return new Plugins.ScrollTrigger(this.placeholder, options);
	};

	Plugins.Chaser = Chaser;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
