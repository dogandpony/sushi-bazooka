/* ==============================================================================================
 * SCROLL TRIGGER (scroll spy)
 * ============================================================================================== */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var BasePlugin = Plugins.BasePlugin;
	var Events = Sushi.Events;
	var Util = Sushi.Util;

	var ScrollTrigger = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		this.enable();
		this.checkPosition();
	};

	ScrollTrigger.displayName = "ScrollTrigger";

	ScrollTrigger.DEFAULTS = {
		updateThreshold: 30,
		offset: 0,
		triggerPosition: "top",
		eventBefore: null,
		eventWhile: null,
		eventAfter: null,
	};

	ScrollTrigger.prototype = Object.create(BasePlugin.prototype);

	var proto = ScrollTrigger.prototype;

	proto.constructor = ScrollTrigger;

	proto.enable = function () {
		Events(window).on(
			this.id + ".ScrollTrigger.resize " + this.id + ".ScrollTrigger.scroll",
			Sushi.Util.throttle(this.checkPosition.bind(this), this.options.updateThreshold)
		);
	};

	proto.disable = function () {
		Events(window).off(this.id + ".ScrollTrigger.resize " + this.id + ".ScrollTrigger.scroll");
	};

	proto.checkPosition = function () {
		var elementOffset = Util.Css.getOffset(this.triggerElement).top;
		var triggerOffset;
		var activationPoint;
		var limitPoint = (elementOffset + Util.Css.getHeight(this.triggerElement));
		var fn = null;

		var offset;

		if (typeof this.options.offset === "function") {
			offset = this.options.offset();
		}
		else {
			offset = parseInt(this.options.offset);
		}

		switch (this.options.triggerPosition) {
			case "top":
				triggerOffset = window.pageYOffset;
				activationPoint = (elementOffset - offset);
				limitPoint -= offset;

				break;

			case "bottom":
				triggerOffset = window.pageYOffset + window.innerHeight;
				activationPoint = (elementOffset + offset);
				limitPoint += offset;

				break;
		}

		if (triggerOffset < activationPoint) {
			fn = this.options.eventBefore;
		}
		else if ((this.options.eventWhile !== null) && (triggerOffset < limitPoint)) {
			fn = this.options.eventWhile;
		}
		else {
			fn = this.options.eventAfter;
		}

		if (typeof fn === "string") {
			fn = Sushi.Actions.parseController(fn);
		}

		if (typeof fn === "function") {
			fn(this.triggerElement, this.options);
		}
	};

	Plugins.ScrollTrigger = ScrollTrigger;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
