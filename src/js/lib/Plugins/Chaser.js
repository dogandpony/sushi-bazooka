/* =========================================================================
 * chasing Header
 * ========================================================================= */

var Sushi;

(function (Sushi) {

	"use strict";

	var DEFAULT_OPTIONS = {
		placeholder: "<i class=\"o-chaserPlaceholder\">",
		updateThreshold: 30,
		updatePlaceholderHeight: true,
	};

	var Chaser = function (element, options) {

		element.data("chaser", this);

		this.triggerElement = element;
		this.id = Sushi.Util.uniqueId();
		this.limitElement = null;
		this.topMargin = 0;

		this.options = $.extend(
			{},
			DEFAULT_OPTIONS,
			options,
			Sushi.Util.getNamespaceProperties("chaser", this.triggerElement.data())
		);

		this.placeholder = $(this.options.placeholder); // cache placeholder object

		// these flags may come in handy when extending functionality
		this.isChasing = false;
		this.hasReachedLimit = false;

		this.placeholder.insertAfter(this.triggerElement);

		this.triggerElement.addClass("o-chaser");

		this.enable();
		this.update();

	};

	Chaser.prototype.enable = function () {

		$(window).on(
			"resize.Chaser." + this.id + " scroll.Chaser." + this.id,
			Sushi.Util.throttle(this.update.bind(this), this.options.updateThreshold)
		);

	};

	Chaser.prototype.disable = function () {

		$(window).off("resize.Chaser." + this.id + " scroll.Chaser." + this.id);

	};

	Chaser.prototype.update = function () {

		this.triggerElement.trigger("beforeUpdate.Chaser");

		this.checkPosition();

		if (this.options.updatePlaceholderHeight) {
			this.updatePlaceholderHeight();
		}

		this.triggerElement.trigger("afterUpdate.Chaser");

	};

	Chaser.prototype.updatePlaceholderHeight = function () {

		this.placeholder.height(this.triggerElement.outerHeight(true));

	};

	Chaser.prototype.isChasingAt = function (scrollY) {

		return (scrollY >= (this.placeholder.offset().top - this.topMargin));

	};

	Chaser.prototype.checkPosition = function () {

		if (this.isChasingAt(window.scrollY)) {
			this.triggerElement.addClass("is-chasing");
			this.isChasing = true;

			if (this.limitElement) {
				var windowHeight = $(window).height();

				var elementHeightOverflow = Math.max(
					0,
					this.triggerElement.outerHeight() - windowHeight
				);

				var overflow = (
					scrollY +
					Math.min(this.triggerElement.outerHeight(), windowHeight) +
					this.topMargin +
					elementHeightOverflow -
					(
						this.limitElement.position().top +
						this.limitElement.height()
					)
				);

				if (overflow > 0) {
					this.triggerElement.addClass("is-limited");
					this.hasReachedLimit = true;

					this.triggerElement.css("top", this.topMargin + (overflow * -1));
				}
				else {
					this.triggerElement.removeClass("is-limited");
					this.hasReachedLimit = false;

					this.triggerElement.css("top", this.topMargin);
				}
			}
		}
		else {
			this.triggerElement.removeClass("is-chasing");
			this.isChasing = false;

			this.triggerElement.css("top", "");
		}

	};

	Chaser.prototype.forceFix = function () {

		this.triggerElement.addClass("is-chasing");

	};

	Sushi.Chaser = Chaser;

})(Sushi || (Sushi = {}));
