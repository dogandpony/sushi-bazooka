/* =========================================================================
 * Chaser Plugin
 * ========================================================================= */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var BasePlugin = Plugins.BasePlugin;
	var Css = Sushi.Util.Css;
	var Dom = Sushi.Dom;
	var Events = Sushi.Events;

	var Chaser = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		this.limitElement = null;
		this.topMargin = 0;

		this.placeholder = Dom.getOne(this.options.placeholder); // cache placeholder object

		this.isChasing = false;
		this.hasReachedLimit = false;

		this.triggerElement.insertAdjacentElement("afterend", this.placeholder);
		this.triggerElement.classList.add("o-chaser");

		this.enable();
		this.update();
	};

	Chaser.displayName = "Chaser";

	Chaser.DEFAULTS = {
		placeholder: "<i class=\"o-chaserPlaceholder\">",
		updateThreshold: 30,
		updatePlaceholderHeight: true,
	};

	Chaser.prototype = Object.create(BasePlugin.prototype);

	var proto = Chaser.prototype;

	proto.constructor = Chaser;

	proto.enable = function () {
		Events(window).on(
			"Chaser.resize Chaser.scroll",
			Sushi.Util.throttle(this.update.bind(this), this.options.updateThreshold)
		);
	};

	proto.disable = function () {
		Events(window).off("Chaser.resize Chaser.scroll", this.update.bind(this));
	};

	proto.update = function () {
		Events(this.triggerElement).trigger("Chaser.beforeUpdate");

		this.checkPosition();

		if (this.options.updatePlaceholderHeight) {
			this.updatePlaceholderHeight();
		}

		Events(this.triggerElement).trigger("Chaser.afterUpdate");
	};

	proto.updatePlaceholderHeight = function () {
		this.placeholder.style.height = Css.getHeight(this.triggerElement, true);
	};

	proto.isChasingAt = function (scrollY) {
		return (scrollY >= (Css.getOffset(this.placeholder).top - this.topMargin));
	};

	proto.checkPosition = function () {
		if (this.isChasingAt(window.scrollY)) {
			this.triggerElement.classList.add("is-chasing");
			this.isChasing = true;

			if (this.limitElement) {
				var windowHeight = window.innerHeight;
				var elementHeight = Css.getHeight(this.triggerElement);

				var elementHeightOverflow = Math.max(0, (elementHeight - windowHeight));

				var overflow = (
					scrollY +
					Math.min(elementHeight, windowHeight) +
					this.topMargin +
					elementHeightOverflow -
					(
						Css.getOffset(this.limitElement, this.limitElement.parentElement).top +
						Css.getHeight(this.limitElement)
					)
				);

				if (overflow > 0) {
					this.triggerElement.classList.add("is-limited");
					this.hasReachedLimit = true;

					this.triggerElement.style.top = (this.topMargin + (overflow * -1)) + "px";
				}
				else {
					this.triggerElement.classList.remove("is-limited");
					this.hasReachedLimit = false;

					this.triggerElement.style.top = this.topMargin + "px";
				}
			}
		}
		else {
			this.triggerElement.classList.remove("is-chasing");
			this.isChasing = false;

			this.triggerElement.style.top = "";
		}
	};

	proto.forceFix = function () {
		this.triggerElement.classList.remove("is-chasing");
	};

	Plugins.Chaser = Chaser;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
