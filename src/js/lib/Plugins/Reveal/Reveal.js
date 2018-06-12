/* =========================================================================
 * Accordion
 *
 * "So many times I'm watching you"
 * ========================================================================= */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var Events = Sushi.Events;
	var Util = Sushi.Util;

	var transitionEndEvent = Util.getTransitionEndEvent();


	// Class definition
	// ---------------------------

	var Reveal = function (triggerElement, options) {
		this.triggerElement = triggerElement || null;

		this.isOpen = false;

		this.options = Util.merge(
			{},
			Reveal.DEFAULTS,
			options,
			Util.getNamespaceProperties("reveal", this.triggerElement.dataset)
		);

		// Cache Elements
		this.targetElement = document.querySelector(this.options.target);
		this.contentElement = this.targetElement.querySelector(".o-reveal__content");

		var maxHeight = window.getComputedStyle(this.targetElement).maxHeight;
		var maxWidth = window.getComputedStyle(this.targetElement).maxWidth;

		this.autoHeight = (maxHeight !== "none") && (parseInt(maxHeight) === 0);
		this.autoWidth = (maxWidth !== "none") && (parseInt(maxWidth) === 0);

		this.registerListeners();
	};

	Reveal.DEFAULTS = {
		preventDefault: true,
		rel: null,
	};



	// Methods
	// ---------------------------

	var proto = Reveal.prototype;


	proto.registerListeners = function () {
		if (this.triggerElement !== null) {
			Events(this.triggerElement).on("Reveal.click", function (event) {
				if (this.options.preventDefault) {
					event.preventDefault();
				}

				this.toggle();
			}.bind(this));
		}
	};


	proto.prepare = function () {
		this.targetElement.classList.add("is-animating");

		if (this.autoHeight) {
			this.targetElement.style.maxHeight = this.contentElement.offsetHeight + "px";
		}

		if (this.autoWidth) {
			this.targetElement.style.maxWidth = this.contentElement.offsetWidth + "px";
		}

		this.triggerElement.blur();
	};


	proto.removeAnimationClass = function () {
		Events(this.targetElement).one(transitionEndEvent, function () {
			this.targetElement.classList.remove("is-animating");
		}.bind(this));
	};


	proto.open = function () {
		this.isOpen = true;

		if (this.triggerElement !== null) {
			this.triggerElement.classList.add("is-active");
		}

		this.targetElement.classList.add("is-active");

		Events(this.targetElement).trigger("open");

		this.prepare();

		Events(this.targetElement).one(transitionEndEvent, function () {
			if (this.autoHeight) {
				this.targetElement.style.maxHeight = "none";
			}

			if (this.autoWidth) {
				this.targetElement.style.maxWidth = "none";
			}
		}.bind(this));

		this.removeAnimationClass();
	};


	proto.close = function () {
		this.isOpen = false;

		if (this.triggerElement !== null) {
			this.triggerElement.classList.remove("is-active");
		}

		this.targetElement.classList.remove("is-active");

		Events(this.targetElement).trigger("close");

		this.prepare();

		// force repaint
		window.getComputedStyle(this.targetElement).height;

		if (this.autoHeight) {
			this.targetElement.style.maxHeight = 0;
		}

		if (this.autoWidth) {
			this.targetElement.style.maxWidth = 0;
		}

		this.removeAnimationClass();
	};


	proto.toggle = function () {
		this.isOpen ? this.close() : this.open();
	};


	Plugins.Reveal = Reveal;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
