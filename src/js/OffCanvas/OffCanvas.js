/* =========================================================================
 * Off-canvas
 *
 * Depends on jQuery and hammerjs.
 *
 * @TODO Option to open from right or from left
 * @TODO Support for two Off-canvases?
 * ========================================================================= */

var Sushi;

(function (Sushi) {
	"use strict";



	// Class definition
	// ---------------------------

	var OffCanvas = function (toggle, options) {
		this.toggle = $(toggle);
		this.id = Sushi.Util.uniqueId("offCanvas");

		this.options = $.extend(
			{},
			OffCanvas.DEFAULT_OPTIONS,
			options,
			Sushi.Util.getNamespaceProperties("offCanvas", this.toggle.data())
		);

		this.isOpen = false;

		this.init();
	};

	OffCanvas.DEFAULT_OPTIONS = {
		lockScrollWhileOpen: false,
		overlayContainer: $("body"),
	};



	// Methods
	// ---------------------------

	OffCanvas.prototype.constructor = OffCanvas;

	OffCanvas.prototype.init = function () {
		this.options.container.hammer();
		this.options.container.addClass("o-offCanvas");
		this.createOverlay();
		this.registerListeners();
	};

	OffCanvas.prototype.createOverlay = function () {
		this.overlay = $("<div class=\"o-offCanvasOverlay\"/>");

		if (this.options.overlayExtraClasses) {
			this.overlay.addClass(this.options.overlayExtraClasses);
		}

		this.overlay.hammer();
		this.overlay.appendTo(this.options.overlayContainer);
	};

	OffCanvas.prototype.toggleContainer = function () {
		if (this.options.container.hasClass("is-open")) {
			this.closeContainer();
		}
		else {
			this.openContainer();
		}
	};

	OffCanvas.prototype.openContainer = function () {
		var event = $.Event("open.OffCanvas");

		event.OffCanvas = this;

		this.options.container.trigger(event);

		if (this.options.lockScrollWhileOpen) {
			Sushi.BodyScroll.lock(this.id);
		}

		$("html").addClass("has-offCanvasOpen");

		this.toggle.addClass("is-active");
		this.options.container.addClass("is-open");

		this.isOpen = true;

		return this;
	};

	OffCanvas.prototype.closeContainer = function () {
		this.options.container.removeClass("is-open");

		var event = $.Event("close.OffCanvas");

		event.OffCanvas = this;

		setTimeout(function () {
			if (this.options.lockScrollWhileOpen) {
				Sushi.BodyScroll.unlock(this.id);
			}

			$("html").removeClass("has-offCanvasOpen");

			this.toggle.removeClass("is-active");

			this.options.container.trigger(event);
		}.bind(this));

		this.isOpen = true;

		return this;
	};

	OffCanvas.prototype.registerListeners = function () {
		var that = this;

		this.toggle.on("click.OffCanvas", function (event) {
			event.preventDefault();

			that.toggleContainer();
		});

		this.overlay.on("tap.OffCanvas", $.proxy(this.closeContainer, this));

		return this;
	};

	OffCanvas.prototype.panStart = function () {
		this.isPanning = true;
		this.options.container.addClass("is-panning");
	};

	OffCanvas.prototype.pan = function (event) {
		if (this.isPanning) {
			var translate;
			var containerWidth = this.options.container.width();

			if (event.gesture.deltaX > 0) {
				translate = 0;
			}
			else {
				translate = ((100 / containerWidth) * event.gesture.deltaX);
			}

			this.translate = translate;

			this.options.container.css({
				"-webkit-transform": "translateX(" + translate + "%)",
				"-moz-transform": "translateX(" + translate + "%)",
				"transform": "translateX(" + translate + "%)",
			});
		}

		return this;
	};

	OffCanvas.prototype.panEnd = function () {
		this.isPanning = false;
		this.options.container.removeClass("is-panning");

		this.options.container.removeAttr("style");

		if (this.translate < -75) {
			this.closeContainer();
		}
	};

	Sushi.OffCanvas = OffCanvas;
})(Sushi || (Sushi = {}));
