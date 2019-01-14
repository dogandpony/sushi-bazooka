/* ==============================================================================================
 * OFF-CANVAS
 * ============================================================================================== */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var Events = Sushi.Events;
	var Modal = Plugins.Modal;
	var Util = Sushi.Util;

	var OffCanvas = function (triggerElement, options) {
		Modal.call(this, triggerElement, options);

		this.contentWrapper = this.element.getElementsByClassName("c-modal__contentWrapper")
			.item(0);

		// Reset this.options.from to the vertical position anchor if invalid
		if ((this.options.from !== this.anchors.x) && (this.options.from !== this.anchors.y)) {
			this.options.from = this.anchors.x;
		}

		this.element.classList.add("c-modal--offCanvas");
		this.element.classList.add(
			"c-modal--from" + Util.firstCharacterToUpperCase(this.options.from)
		);
	};

	OffCanvas.displayName = "OffCanvas";

	OffCanvas.DEFAULTS = Object.assign({}, Modal.DEFAULTS, {
		position: "top left",
		from: "left",
		closeThreshold: 0.2,
	});

	OffCanvas.prototype = Object.create(Modal.prototype);

	var proto = OffCanvas.prototype;

	proto.constructor = OffCanvas;

	proto.validateOptions = function () {
		var validated = Modal.prototype.validateOptions.call(this);

		if (["center", "middle"].includes(this.options.from)) {
			// eslint-disable-next-line no-console
			console.warn(
				"OffCanvas: \"center\" and \"middle\" are not supported values for \"from\" option."
				+ "\nThe default value (\"left\") will be used instead."
			);
		}

		return validated;
	};

	proto.registerListeners = function () {
		Modal.prototype.registerListeners.call(this);

		var start = {
			x: 0,
			y: 0,
		};
		var delta = {
			x: 0,
			y: 0,
		};

		var onTouchStart = function (event) {
			this.element.classList.add("is-panning");

			start.x = event.touches[0].clientX;
			start.y = event.touches[0].clientY;
		};

		var onTouchMove = function (event) {
			delta.x = (event.touches[0].clientX - start.x);
			delta.y = (event.touches[0].clientY - start.y);

			this.translateContentWrapper(delta.x, delta.y);
		};

		var onTouchEnd = function () {
			var computedStyle = window.getComputedStyle(this.contentWrapper);

			this.element.classList.remove("is-panning");

			this.contentWrapper.removeAttribute("style");

			if (
				["left", "right"].includes(this.options.from)
				&& (Math.abs(delta.x) >= (
					parseInt(computedStyle.width) * this.options.closeThreshold
				))
			) {
				this.close();
			}
			else if (
				["top", "bottom"].includes(this.options.from)
				&& (Math.abs(delta.y) >= (
					parseInt(computedStyle.height) * this.options.closeThreshold
				))
			) {
				this.close();
			}
		};

		Events(this.overlay)
			.on("touchstart", onTouchStart.bind(this))
			.on("touchmove", onTouchMove.bind(this))
			.on("touchend", onTouchEnd.bind(this));



		/* Dragging click cancel
		 * --------------------------- */

		var clickPosition = {
			x: 0,
			y: 0,
		};

		var onOverlayMouseDown = function (event) {
			clickPosition.x = event.clientX;
			clickPosition.y = event.clientY;
		};

		var onOverlayClick = function (event) {
			var deltaX = Math.abs(event.clientX - clickPosition.x);
			var deltaY = Math.abs(event.clientY - clickPosition.y);
			var maxDelta = Math.max(deltaX, deltaY);

			if (maxDelta > 10) {
				event.stopImmediatePropagation();
			}
		};

		Events(this.overlay).on("mousedown", onOverlayMouseDown.bind(this));
		Events(this.overlay).on("click", onOverlayClick.bind(this));
	};


	proto.translateContentWrapper = function (x, y) {
		var delta = {
			x: 0,
			y: 0,
		};

		// Left, Right
		if (["left", "right"].includes(this.options.from)) {
			if (this.options.from === "left") {
				delta.x = Math.min(0, x);
			}
			// Right
			else {
				delta.x = Math.max(0, x);
			}

		}
		// Top, Bottom
		else {
			if (this.options.from === "top") {
				delta.y = Math.min(0, y);
			}
			// Bottom
			else {
				delta.y = Math.max(0, y);
			}
		}

		this.contentWrapper.style.transform = "translate3d(" + delta.x + "px, " + delta.y + ", 0)";
	};

	Plugins.OffCanvas = OffCanvas;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
