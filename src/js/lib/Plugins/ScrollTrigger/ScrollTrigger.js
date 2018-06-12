var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var Events = Sushi.Events;
	var Util = Sushi.Util;

	var ScrollTrigger = function (element, options) {
		this.triggerElement = $(element);

		this.options = Util.deepMerge(
			{},
			ScrollTrigger.DEFAULTS,
			options,
			Sushi.Util.getNamespaceProperties("scrollTrigger", this.triggerElement.dataset)
		);

		this.enable();
	};

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

	ScrollTrigger.prototype.enable = function () {
		Events(window).on(
			"ScrollTrigger.resize ScrollTrigger.scroll",
			Sushi.Util.throttle(this.checkPosition.bind(this), this.options.updateThreshold)
		);
	};

	ScrollTrigger.prototype.disable = function () {
		Events(window).off("ScrollTrigger.resize ScrollTrigger.scroll");
	};

	ScrollTrigger.prototype.checkPosition = function () {
		var elementOffset = this.triggerElement.offset().top;
		var triggerOffset;
		var activationPoint;
		var limitPoint = (elementOffset + this.triggerElement.outerHeight());

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
