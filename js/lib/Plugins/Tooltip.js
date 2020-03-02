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

		this.create();
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

	proto.create = function () {
		this.triggerBeforeCreateEvent();

		this.tooltip = document.createElement("div");
		this.tooltip.classList.add("c-tooltip");

		this.arrow = document.createElement("i");
		this.arrow.classList.add("c-tooltip__arrow");

		this.content = document.createElement("div");
		this.content.classList.add("c-tooltip__content");
		this.content.innerHTML = this.options.content;

		this.tooltip.appendChild(this.arrow);
		this.tooltip.appendChild(this.content);

		document.body.appendChild(this.tooltip);

		this.triggerAfterCreateEvent();
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

		// Required rects
		var bodyRect = document.body.getBoundingClientRect();
		var tooltipRect = this.tooltip.getBoundingClientRect();
		var triggerElementRect = this.triggerElement.getBoundingClientRect();
		var lineRects = this.triggerElement.getClientRects();
		var firstLineRect = lineRects[0];
		var lastLineRect = lineRects[lineRects.length - 1];
		var triggerElementCoords = getCoords(this.triggerElement);

		// Min and max to prevent overflow
		var minX = this.options.horizontalMargin;
		var maxX = (bodyRect.width - this.options.horizontalMargin);

		// Placement
		var top;
		var left;
		var offset;

		// Closes if rects are not found
		if (!bodyRect || !tooltipRect || !firstLineRect || !triggerElementCoords) {
			return this.close();
		}

		// Find top and left
		switch (this.options.position) {
			case "top":
				top = triggerElementCoords.top - tooltipRect.height - 10;
				left = firstLineRect.left + (firstLineRect.width / 2);
				break;

			case "bottom":
				top = triggerElementCoords.top + triggerElementRect.height + 10;
				left = lastLineRect.left + (lastLineRect.width / 2);
				break;

			case "left":
				top = triggerElementCoords.top - (tooltipRect.height / 2) + (firstLineRect.height / 2);
				left = firstLineRect.left - (tooltipRect.width / 2) - 10;
				break;

			case "right":
				top = triggerElementCoords.top + triggerElementRect.height
					- (tooltipRect.height / 2) - (lastLineRect.height / 2);
				left = lastLineRect.left + lastLineRect.width + (tooltipRect.width / 2) + 10;
				break;
		}

		// Set tooltip placements
		this.tooltip.style.top = top + "px";
		this.tooltip.style.left = left + "px";
		this.arrow.style.marginLeft = "0";

		// Fixes overflow
		tooltipRect = this.tooltip.getBoundingClientRect();
		var overflowingRight = tooltipRect.right > maxX;
		var overflowingLeft = minX > tooltipRect.left;

		switch (this.options.position) {
			case "top":
			case "bottom":
				if (overflowingRight) {
					offset = tooltipRect.right - maxX;
					this.tooltip.style.left = left - offset + "px";
					this.arrow.style.marginLeft = offset + "px";
				}

				if (overflowingLeft) {
					offset = minX - tooltipRect.left;
					this.tooltip.style.left = left + offset + "px";
					this.arrow.style.marginLeft = -offset + "px";
				}

				break;

			case "left":
				if (overflowingLeft) {
					this.options.position = "top";
					this.tooltip.classList.remove("c-tooltip--left");
					this.tooltip.classList.add("c-tooltip--top");
					this.centerTooltip();
				}
				break;

			case "right":
				if (overflowingRight) {
					this.options.position = "bottom";
					this.tooltip.classList.remove("c-tooltip--right");
					this.tooltip.classList.add("c-tooltip--bottom");
					this.centerTooltip();
				}
				break;
		}
	};

	function getCoords(elem) {
		var box = elem.getBoundingClientRect();

		var body = document.body;
		var docEl = document.documentElement;

		var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
		var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

		var clientTop = docEl.clientTop || body.clientTop || 0;
		var clientLeft = docEl.clientLeft || body.clientLeft || 0;

		var top = box.top + scrollTop - clientTop;
		var left = box.left + scrollLeft - clientLeft;

		return {top: Math.round(top), left: Math.round(left)};
	}

	Plugins.Tooltip = Tooltip;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
