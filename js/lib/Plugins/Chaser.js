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

		if (!this.options.updatePlaceholderHeight) {
			return;
		}

		Events(window).on(
			this.id + ".Chaser.resize " + this.id + ".Chaser.scroll",
			Sushi.Util.throttle(
				this.updatePlaceholderHeight.bind(this),
				this.options.updateThreshold
			)
		);
	};

	proto.disable = function () {
		if (!this.isEnabled) {
			return;
		}

		this.isEnabled = false;

		this.scrollTrigger.disable();

		if (!this.options.updatePlaceholderHeight) {
			return;
		}

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
