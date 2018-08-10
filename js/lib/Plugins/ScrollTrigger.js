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
	};

	ScrollTrigger.displayName = "ScrollTrigger";

	ScrollTrigger.DEFAULTS = {
		updateThreshold: 30,
		offset: 0,
		triggerPosition: "top",
		events: {
			before: null,
			while: null,
			after: null,
		},
	};

	ScrollTrigger.prototype = Object.create(BasePlugin.prototype);

	var proto = ScrollTrigger.prototype;

	proto.constructor = ScrollTrigger;

	proto.enable = function () {
		Events(window).on(
			"ScrollTrigger.resize ScrollTrigger.scroll",
			Sushi.Util.throttle(this.checkPosition.bind(this), this.options.updateThreshold)
		);
	};

	proto.disable = function () {
		Events(window).off("ScrollTrigger.resize ScrollTrigger.scroll");
	};

	proto.checkPosition = function () {
		var elementOffset = Util.Css.getOffset(this.triggerElement).top;
		var triggerOffset;
		var activationPoint;
		var limitPoint = (elementOffset + Util.Css.getHeight(this.triggerElement));

		var offset;

		if (typeof this.options.offset === "function") {
			offset = this.options.offset();
		}
		else {
			offset = this.options.offset;
		}

		switch (this.options.triggerPosition) {
			case "top":
				triggerOffset = window.scrollY;
				activationPoint = (elementOffset - offset);
				limitPoint -= offset;
				break;

			case "bottom":
				triggerOffset = window.scrollY + window.innerHeight;
				activationPoint = (elementOffset + offset);
				limitPoint += offset;
				break;
		}

		if (
			(typeof this.options.events.before === "function")
			&& (triggerOffset < activationPoint)
		) {
			this.options.events.before(this.triggerElement, this.options);
		}
		else if (
			(typeof this.options.events.while === "function")
			&& (triggerOffset >= activationPoint)
			&& (triggerOffset < limitPoint)
		) {
			this.options.events.while(this.triggerElement, this.options);
		}
		else if (
			(typeof this.options.events.after === "function")
			&& (triggerOffset >= activationPoint)
		) {
			this.options.events.after(this.triggerElement, this.options);
		}
	};

	Plugins.ScrollTrigger = ScrollTrigger;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
