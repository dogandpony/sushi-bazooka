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

		this.scrollTrigger = this.getScrollTriggerInstance();

		this.enable();
		this.updatePlaceholderHeight();
	};

	Chaser.displayName = "Chaser";

	Chaser.DEFAULTS = Object.assign({}, Plugins.ScrollTrigger.DEFAULTS, {
		placeholder: "<i class=\"o-chaserPlaceholder\">",
		updatePlaceholderHeight: true,
		updateThreshold: 30,
		offset: 0,
		limit: null,
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
			Sushi.Util.throttle(this.checkPosition.bind(this), this.options.updateThreshold)
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

		this.options.eventBefore = function () {
			this.triggerElement.classList.remove("is-chasing");

			this.runEvent(eventBefore);
		}.bind(this);

		this.options.eventAfter = function () {
			this.triggerElement.classList.add("is-chasing");

			this.runEvent(eventAfter);
		}.bind(this);
	};

	proto.runEvent = function (fn) {
		if (typeof fn === "string") {
			fn = Sushi.Actions.parseController(fn);
		}

		if (typeof fn === "function") {
			fn(this);
		}
	};

	proto.checkPosition = function () {
		if (this.options.updatePlaceholderHeight) {
			this.updatePlaceholderHeight();
		}

		this.updateLimit();
	};

	proto.updateLimit = function () {
		var untilPosition;

		if (this.options.limit == null) {
			return;
		}

		if (isNaN(this.options.limit)) {
			var untilElement = Dom.get(this.options.limit);

			untilPosition = Util.Css.getOffset(untilElement).top;
		}
		else {
			untilPosition = this.options.limit;
		}

		untilPosition -= this.placeholder.clientHeight;

		if (untilPosition + this.scrollTrigger.getOffset() - window.scrollY < 0) {
			this.triggerElement.classList.add("is-limited");
			this.triggerElement.style.transform = "translateY(" + (
				untilPosition
				- Util.Css.getOffset(this.placeholder).top
			) + "px)";
		}
		else {
			this.triggerElement.classList.remove("is-limited");
			this.triggerElement.style.transform = "";
		}
	};

	proto.updatePlaceholderHeight = function () {
		this.placeholder.style.height = Css.getHeight(this.triggerElement, true) + "px";
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
