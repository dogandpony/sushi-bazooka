/* ==============================================================================================
 * REVEAL
 *
 * "A gente se ilude dizendo 'já não há mais coração'"
 * ============================================================================================== */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var BasePlugin = Plugins.BasePlugin;
	var Dom = Sushi.Dom;
	var Events = Sushi.Events;
	var Util = Sushi.Util;

	var transitionEndEvent = Util.getTransitionEndEvent();

	var Reveal = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		this.targetElement = Dom.get(this.options.target);

		Sushi.addPluginInstanceTo(this.targetElement, this);

		this.isOpen = (
			this.triggerElement.classList.contains("is-active")
			|| this.targetElement.classList.contains("is-active")
		);

		this.zeroDimensions();

		this.registerListeners();

		if (!this.isOpen) {
			return;
		}

		this.removeDimensionSettings();
	};

	Reveal.displayName = "Reveal";

	Reveal.DEFAULTS = {
		animateDimensions: "height", // "height", "width", "both"
		preventDefault: true,
		rel: null,
		target: null,
	};

	Reveal.prototype = Object.create(BasePlugin.prototype);

	var proto = Reveal.prototype;

	proto.constructor = Reveal;

	proto.registerListeners = function () {
		Events(this.triggerElement).on("Reveal.click", function (event) {
			if (this.options.preventDefault) {
				event.preventDefault();
			}

			this.toggle();
		}.bind(this));
	};


	proto.updateMaxHeight = function () {
		if (this.animatesHeight()) {
			this.targetElement.style.maxHeight = this.targetElement.scrollHeight + "px";
		}

		if (this.animatesWidth()) {
			this.targetElement.style.maxWidth = this.targetElement.scrollWidth + "px";
		}
	};


	proto.removeFocusFromTriggerElement = function () {
		if (this.triggerElement === null) {
			return;
		}

		this.triggerElement.blur();
	};


	proto.open = function () {
		if (this.isOpen) {
			return;
		}

		this.isOpen = true;

		this.registerAnimationEndEvents();

		this.addOpenClasses();

		this.addAnimatingClass();
		this.updateMaxHeight();
		this.removeFocusFromTriggerElement();

		this.triggerOpenEvents();
	};


	proto.close = function () {
		if (!this.isOpen) {
			return;
		}

		this.isOpen = false;

		this.addAnimatingClass();
		this.updateMaxHeight();
		this.removeFocusFromTriggerElement();

		this.forceRepaint();

		this.removeOpenClasses();
		this.registerAnimationEndEvents();
		this.triggerCloseEvents();

		this.zeroDimensions();
	};


	proto.addAnimatingClass = function () {
		this.targetElement.classList.add("is-animating");
	};


	proto.removeAnimatingClass = function () {
		this.targetElement.classList.remove("is-animating");
	};


	proto.addOpenClasses = function () {
		if (this.triggerElement !== null) {
			this.triggerElement.classList.add("is-active");
		}

		this.targetElement.classList.add("is-active");
	};


	proto.removeOpenClasses = function () {
		if (this.triggerElement !== null) {
			this.triggerElement.classList.remove("is-active");
		}

		this.targetElement.classList.remove("is-active");
	};


	proto.triggerOpenEvents = function () {
		Events(this.targetElement).trigger("Reveal.open");
		Events(this.triggerElement).trigger("Reveal.open");
	};


	proto.triggerCloseEvents = function () {
		Events(this.targetElement).trigger("Reveal.close");
		Events(this.triggerElement).trigger("Reveal.close");
	};


	proto.triggerOpenedEvents = function () {
		Events(this.targetElement).trigger("Reveal.opened");
		Events(this.triggerElement).trigger("Reveal.opened");
	};


	proto.triggerClosedEvents = function () {
		Events(this.targetElement).trigger("Reveal.closed");
		Events(this.triggerElement).trigger("Reveal.closed");
	};


	proto.registerAnimationEndEvents = function () {
		var eventType = "Reveal.animation." + transitionEndEvent;

		Events(this.targetElement)
			.off(eventType)
			.one(eventType, handleTransitionEnd.bind(this));
	};


	proto.toggle = function () {
		this.isOpen ? this.close() : this.open();
	};


	proto.forceRepaint = function () {
		Util.forceRepaint(this.targetElement);
	};


	proto.animatesWidth = function () {
		return ["width", "both"].includes(this.options.animateDimensions.toLowerCase());
	};


	proto.animatesHeight = function () {
		return ["height", "both"].includes(this.options.animateDimensions.toLowerCase());
	};


	proto.removeDimensionSettings = function () {
		if (this.animatesHeight()) {
			this.targetElement.style.maxHeight = "none";
		}

		if (this.animatesWidth()) {
			this.targetElement.style.maxWidth = "none";
		}
	};


	proto.zeroDimensions = function () {
		if (this.animatesHeight()) {
			this.targetElement.style.maxHeight = "0";
		}

		if (this.animatesWidth()) {
			this.targetElement.style.maxWidth = "0";
		}
	};


	var handleTransitionEnd = function () {
		this.targetElement.classList.remove("is-animating");

		if (this.isOpen) {
			this.removeDimensionSettings();
			this.triggerOpenedEvents();

			return;
		}

		this.triggerClosedEvents();
	};


	Plugins.Reveal = Reveal;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
