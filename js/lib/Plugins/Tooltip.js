/* =====================================================================
 * Tooltip plugin for Sushi
 * ===================================================================== */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var BasePlugin = Plugins.BasePlugin;
	var Events = Sushi.Events;

	var BASE_CLASSNAME = "c-tooltip";

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
	};

	Tooltip.prototype = Object.create(BasePlugin.prototype);

	var proto = Tooltip.prototype;

	proto.constructor = Tooltip;

	proto.registerEventListeners = function () {
		Events.on(this.options.triggerEvent, this.triggerElement, this.toggle.bind(this));
	};

	proto.createTooltip = function () {
		var contentElement = document.createElement("div");

		contentElement.classList.add(BASE_CLASSNAME + "__content");
		contentElement.innerHTML = this.options.content;

		this.tooltip = document.createElement("div");
		this.tooltip.appendChild(contentElement);
		this.tooltip.classList.add(BASE_CLASSNAME);

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
		this.isOpen = true;

		setTimeout(function () {
			if (this.isOpen) {
				this.tooltip.classList.add("is-open");

				this.centerTooltip();
			}
		}.bind(this), this.options.delay);
	};

	proto.close = function () {
		this.isOpen = false;

		this.tooltip.classList.remove("is-open");
	};

	proto.addPositionClass = function () {
		this.tooltip.classList.add(BASE_CLASSNAME + "--" + this.options.position);
	};

	proto.centerTooltip = function () {
		switch (this.options.position) {
			case "top":
			case "bottom":
				this.tooltip.style.marginLeft =
					(this.tooltip.getBoundingClientRect().width / -2) + "px";
				break;

			case "left":
			case "right":
				this.tooltip.style.marginTop =
					(this.tooltip.getBoundingClientRect().height / -2) + "px";
				break;
		}
	};

	Plugins.Tooltip = Tooltip;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
