/* =====================================================================
 * Loading Indicator
 * ===================================================================== */

var Sushi;

(function (Sushi) {
	"use strict";

	var Util = Sushi.Util;

	var LoadingIndicator = function (container, options) {
		this.container = container;

		this.options = Util.merge({}, LoadingIndicator.DEFAULTS, options);

		this.loadingIndicator = document.createElement("i");
		this.loadingIndicator.classList.add("c-loadingIndicator");
		this.loadingIndicator.innerHTML = this.options.icon;

		for (var i in this.options.modifiers) {
			if (this.options.modifiers.hasOwnProperty(i)) {
				this.loadingIndicator.classList.add(
					"c-loadingIndicator--" + this.options.modifiers[i]
				);
			}
		}

		container.appendChild(this.loadingIndicator);
	};

	LoadingIndicator.DEFAULTS = {
		icon: "<i class='c-loadingIndicator__icon'></i>",
		modifiers: [],
	};

	var proto = LoadingIndicator.prototype;

	proto.show = function () {
		this.loadingIndicator.classList.add("is-loading");
	};

	proto.hide = function () {
		this.loadingIndicator.classList.remove("is-loading");
	};

	proto.remove = function () {
		this.container.removeChild(this.loadingIndicator);
	};

	Sushi.LoadingIndicator = LoadingIndicator;
})(Sushi || (Sushi = {}));
