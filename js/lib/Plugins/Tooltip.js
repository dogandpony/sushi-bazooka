/* ==============================================================================================
 * TOOLTIP
 * ============================================================================================== */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var BasePlugin = Plugins.BasePlugin;
	var Events = Sushi.Events;
	var Css = Sushi.Util.Css;

	var Tooltip = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		this.isOpen = false;

		this.createTooltip();
		this.addPositionClass();
		this.registerEventListeners();
	};

	Tooltip.displayName = "Tooltip";

	Tooltip.DEFAULTS = {
		content: "",
		delay: 0,
		position: "top",
		triggerEvent: "click",
		horizontalMargin: 24,
	};

	Tooltip.prototype = Object.create(BasePlugin.prototype);

	var proto = Tooltip.prototype;

	proto.constructor = Tooltip;

	proto.registerEventListeners = function () {
		var events = this.options.triggerEvent.split(" ");

		if (events.length === 1) {
			Events(this.triggerElement).on(this.options.triggerEvent, this.toggle.bind(this));
		}
		else {
			Events(this.triggerElement)
				.on(events[0], this.open.bind(this))
				.on(events[1], this.close.bind(this));
		}
	};

	proto.createTooltip = function () {
		this.tooltip = document.createElement("div");
		this.tooltip.classList.add("c-tooltip");

		this.arrow = document.createElement("i");
		this.arrow.classList.add("c-tooltip__arrow");

		this.content = document.createElement("div");
		this.content.classList.add("c-tooltip__content");
		this.content.innerHTML = this.options.content;

		this.tooltip.appendChild(this.arrow);
		this.tooltip.appendChild(this.content);

		this.triggerElement.appendChild(this.tooltip);
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
		if (this.isOpen) {
			return;
		}

		this.isOpen = true;

		Events(document).off(this.id + ".Tooltip.click");

		this.tooltip.classList.add("is-visible");

		setTimeout(function () {
			if (!this.isOpen) {
				return;
			}

			this.tooltip.classList.add("is-open");

			this.centerTooltip();

			Events(window).on(this.id + ".Tooltip.resize", function () {
				this.centerTooltip();
			}.bind(this));

			if (this.options.triggerEvent !== "click") {
				return;
			}

			Events(document).one(this.id + ".Tooltip.click", function () {
				this.close();
			}.bind(this));
		}.bind(this), this.options.delay);
	};

	proto.close = function () {
		if (!this.isOpen) {
			return;
		}

		this.isOpen = false;

		this.tooltip.classList.remove("is-open");

		clearTimeout(this.closeTimeout);

		this.closeTimeout = setTimeout(function () {
			if (this.isOpen) {
				return;
			}

			this.tooltip.classList.remove("is-visible");

			Events(this.triggerElement).trigger("close");

			Events(window).off(this.id + ".Tooltip.resize");
			Events(document).off(this.id + ".Tooltip.click");
		}.bind(this), Css.getMaxTransitionDuration(this.tooltip));
	};

	proto.addPositionClass = function () {
		this.tooltip.classList.add("c-tooltip" + "--" + this.options.position);
	};

	proto.centerTooltip = function () {
		var bodyRect = document.body.getBoundingClientRect();
		var triggerElementRect = this.triggerElement.getBoundingClientRect();
		var tooltipRect = this.tooltip.getBoundingClientRect();

		var triggerElementCenter = {
			x: triggerElementRect.x + (triggerElementRect.width / 2),
			y: triggerElementRect.y + (triggerElementRect.height / 2),
		};

		var maxWidth = (bodyRect.width - (this.options.horizontalMargin * 2));

		// Shrink the tooltip if it's wider than the max width (window width minus horizontal
		// margin)
		if (tooltipRect.width > maxWidth) {
			this.tooltip.style.width = maxWidth + "px";

			// update rect
			tooltipRect = this.tooltip.getBoundingClientRect();
		}

		var centerXMin = (tooltipRect.width / 2) + this.options.horizontalMargin;
		var centerXMax = (bodyRect.width
			- (tooltipRect.width / 2)
			- this.options.horizontalMargin
		);

		var xOffset = Math.min(
			Math.max(0, (centerXMin - triggerElementCenter.x)),
			(centerXMax - triggerElementCenter.x)
		);

		this.arrow.style.marginLeft = (-1 * xOffset) + "px";

		switch (this.options.position) {
			case "top":
			// fall through

			case "bottom":
				this.tooltip.style.marginLeft = ((tooltipRect.width / -2) + xOffset) + "px";

				break;

			case "left":
			// fall through

			case "right":
				this.tooltip.style.marginTop = (tooltipRect.height / -2) + "px";

				break;
		}
	};

	Plugins.Tooltip = Tooltip;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
