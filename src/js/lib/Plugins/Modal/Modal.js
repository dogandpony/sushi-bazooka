/* =========================================================================
 * Modal
 *
 * Dependencies
 *  - jQuery
 *
 * How to use
 *  Init
 *      var modal = new Sushi.Modal($('.element')[, options]);
 *
 * "What a fool believes"
 * ========================================================================= */

var Sushi;

(function (Sushi) {
	"use strict";

	var Util = Sushi.Util;



	// Private Properties
	// ---------------------------

	var HTML_FACTORY = {
		MODAL: "<div class=\"c-modal\">",
		OVERLAY: "<div class=\"c-modalOverlay\">",
		CONTAINER: "<div class=\"c-modalContainer\">",
		CLOSE_BUTTON: "<a href=\"#!\" data-modal-trigger-close class=\"c-modal__close\"/>",
	};

	var MAIN_CONTAINER = $("<div class=\"c-modals\">");

	var CENTERING_CLASSES = {
		CALCULATED_HORIZONTAL: "c-modalContainer--calculatedHCenter",
		CALCULATED_VERTICAL: "c-modalContainer--calculatedVCenter",
		HORIZONTAL: "c-modalContainer--hCenter",
		VERTICAL: "c-modalContainer--vCenter",
	};



	// Class Definition
	// -------------------------

	var Modal = function (triggerElement, options) {
		this.id = Sushi.Util.uniqueId();
		this.triggerElement = $(triggerElement);
		this.isOpen = false;

		this.options = $.extend(
			{},
			Modal.DEFAULTS,
			options,
			Sushi.Util.getNamespaceProperties("modal", this.triggerElement.data())
		);

		// Cache objects
		this.modal = $(this.options.modal);
		this.overlay = $(this.options.overlay);
		this.container = $(this.options.container);
		this.contentObject = $(this.options.content);

		this.create();

		// Register click listener on triggering element
		if (this.options.registerClickListener) {
			var it = this;

			this.triggerElement.on("click.Modal", function (event) {
				event.preventDefault();

				it.toggle();
			});
		}
	};

	Modal.prototype.constructor = Modal;



	// Static Properties
	// -------------------------

	Modal.DEFAULTS = {
		content: "",
		extraClasses: "",
		overlayExtraClasses: "",
		contentOperation: "copy",
		registerClickListener: true,
		insertCloseButton: true,
		lockScrollWhileOpen: false,
		populateContent: "onOpen", // "onCreate", false
		closeOnOverlayClick: true,
		closeOnEscape: true,

		// Centering
		horizontalCentering: true,
		verticalCentering: false,
		calculatedCentering: false,

		// Containers
		modal: $(HTML_FACTORY.MODAL),
		overlay: $(HTML_FACTORY.OVERLAY),
		container: $(HTML_FACTORY.CONTAINER),
	};

	Modal.openModals = [];



	// Methods
	// -------------------------

	/**
	 * Create the modal and overlay HTML and append it to the body
	 */
	Modal.prototype.create = function () {
		var it = this;

		// Create main container
		this.createMainContainer();

		// Add centering classes to modal
		var classes = [];

		if (this.options.calculatedCentering) {
			if (this.options.horizontalCentering) {
				classes.push(CENTERING_CLASSES.CALCULATED_HORIZONTAL);
			}

			if (this.options.verticalCentering) {
				classes.push(CENTERING_CLASSES.CALCULATED_VERTICAL);
			}
		}
		else {
			if (this.options.horizontalCentering) {
				classes.push(CENTERING_CLASSES.HORIZONTAL);
			}

			if (this.options.verticalCentering) {
				classes.push(CENTERING_CLASSES.VERTICAL);
			}
		}

		if (classes.length > 0) {
			this.container.addClass(classes.join(" "));
		}

		// Register overlay close listener
		if (this.options.closeOnOverlayClick) {
			this.overlay.on("click.Modal.close", function (event) {
				if (event.target === it.container[0]) {
					event.preventDefault();
					it.close();
				}
			});
		}

		// Pre-populate content, if enabled
		if (this.options.populateContent === "onCreate") {
			this.updateContent();
		}

		// Place elements on the main container
		this.modal.addClass(this.options.extraClasses);
		this.overlay.addClass(this.options.overlayExtraClasses);

		this.modal.appendTo(this.container);
		this.container.appendTo(this.overlay);
		this.overlay.appendTo(this.mainContainer);

		// Only register listeners that call updatePosition() if the modal does horizontal or
		// vertical auto-centering
		if (this.options.calculatedCentering
			&& (this.options.horizontalCentering || this.options.verticalCentering)) {
			this.enableCalculatedCentering();
		}
	};


	/**
	 * Create the main modals container if it doesn't already exist
	 */
	Modal.prototype.createMainContainer = function () {
		this.mainContainer = $(this.options.mainContainer || MAIN_CONTAINER);

		if (this.mainContainer[0].parentNode !== null) {
			this.mainContainer.appendTo("body");
		}
	};


	/**
	 * Show the modal
	 */
	Modal.prototype.open = function () {
		var that = this;

		this.isOpen = true;

		// Prevent body scroll if this is the only modal open
		if (this.options.lockScrollWhileOpen && Modal.openModals.length === 0) {
			Sushi.BodyScroll.lock(this.id);
		}

		this.addToOpenModalsList();

		if (this.options.populateContent === "onOpen") {
			this.updateContent();
		}

		// Force redraw so animations can take place
		this.modal.height();

		// Add a close button (if enabled)
		this.closeButton = $(HTML_FACTORY.CLOSE_BUTTON);

		if (this.options.insertCloseButton) {
			this.modal.prepend(this.closeButton);
		}

		// Register close button listener
		this.modal
			.off("click.Modal.close")
			.on("click.Modal.close", "[data-modal-trigger-close]", function (event) {
				event.preventDefault();

				that.close();
			});

		// Show modal and overlay
		this.modal.addClass("is-open");
		this.overlay.addClass("is-open");

		// Trigger open events
		var openModalEvent = $.Event("open.Modal");

		openModalEvent.modal = this;

		this.modal.trigger(openModalEvent);

		if (Modal.openModals.length === 1) {
			var openFirstModalEvent = $.Event("open.first.Modal");

			openFirstModalEvent.modal = this;

			this.modal.trigger(openFirstModalEvent);
		}

		// Update calculated position, if enabled
		if (this.options.calculatedCentering
			&& (this.options.horizontalCentering || this.options.verticalCentering)) {
			this.updatePosition();
		}
	};


	/**
	 * Hide the modal
	 */
	Modal.prototype.close = function () {
		var that = this;

		this.isOpen = false;

		this.modal.removeClass("is-open");
		this.overlay.removeClass("is-open");

		var duration = Util.Css.getMaxTransitionDuration(this.modal.get(0));
		var overlayDuration = Util.Css.getMaxTransitionDuration(this.overlay.get(0));
		var maxDuration = Math.max(duration, overlayDuration, 0);

		var closeModalEvent = $.Event("close.Modal");

		closeModalEvent.modal = this;

		this.removeFromOpenModalsList();

		this.modal.trigger(closeModalEvent);

		// Release body scroll if this is the last modal open
		if (Modal.openModals.length === 0) {
			if (this.options.lockScrollWhileOpen) {
				Sushi.BodyScroll.unlock(this.id);
			}

			var closeLastModalEvent = $.Event("close.last.Modal");

			closeLastModalEvent.modal = this;

			this.modal.trigger(closeLastModalEvent);
		}

		// @TODO: implement this with transitionend event
		setTimeout(function () {
			that.modal.removeClass(that.extraClasses);

			if (that.options.contentOperation === "move") {
				that.contentObject.append(that.modal.children());
			}

			// Trigger closed event
			var closedModalEvent = $.Event("closed.Modal");

			closedModalEvent.modal = this;

			that.modal.trigger(closedModalEvent);

			if (that.options.contentOperation === "move") {
				that.modal.trigger("returnContent.Modal");
			}
		}, maxDuration);
	};


	Modal.prototype.toggle = function () {
		if (this.isOpen) {
			this.close();
		}
		else {
			this.open();
		}
	};


	/**
	 * Updates the content inside the modal
	 */
	Modal.prototype.updateContent = function () {
		this.modal.html("");

		switch (this.options.contentOperation) {
			default:
			case "copy":
				this.modal.html(this.contentObject.html());
				break;

			case "clone":
				this.modal.append(this.contentObject.find("> *").clone(true));
				break;

			case "move":
				this.modal.append(this.contentObject.children());
				break;
		}
	};


	/**
	 * Update the modal position
	 */
	Modal.prototype.updatePosition = function () {
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		var modalWidth = this.modal.outerWidth();
		var modalHeight = this.modal.outerHeight();

		var properties = {};

		if (this.options.horizontalCentering) {
			properties["margin-left"] = (
				(windowWidth > modalWidth)
					? (-1 * Math.ceil(modalWidth / 2)) : (-1 * Math.ceil(windowWidth / 2))
			);
		}

		if (this.options.verticalCentering) {
			properties["margin-top"] = (
				(windowHeight > modalHeight)
					? (-1 * Math.ceil(modalHeight / 2)) : (-1 * Math.ceil(windowHeight / 2))
			);
		}

		this.modal.css(properties);
	};


	/**
	 * Add current modal to open modals list
	 */
	Modal.prototype.addToOpenModalsList = function () {
		Modal.openModals.push(this);
	};


	/**
	 * Remove current modal from open modals list
	 */
	Modal.prototype.removeFromOpenModalsList = function () {
		for (var i = 0; i < Modal.openModals.length; i++) {
			var modal = Modal.openModals[i];

			if (modal.id === this.id) {
				Modal.openModals.splice(i, 1);
			}
		}
	};


	/**
	 * Register listeners
	 */
	Modal.prototype.enableCalculatedCentering = function () {
		var it = this;

		this.modal
			.on("open.Modal", function () {
				$(window).on("resize.Modal." + this.id, function () {
					if (it.isOpen) {
						it.updatePosition();
					}
				});

				it.updatePosition();
			})
			.on("close.Modal", function () {
				$(window).off("resize.Modal." + this.id);
			});
	};


	/**
	 * Returns the topmost modal
	 *
	 * @returns {*}
	 */
	Modal.getCurrent = function () {
		return Modal.openModals[(Modal.openModals.length - 1)];
	};


	/**
	 * Close the topmost modal
	 */
	Modal.closeCurrent = function () {
		Modal.getCurrent().close();
	};



	// Global listeners
	// -------------------------

	$(document).on("open.Modal", function (event) {
		if (event.modal.options.closeOnEscape) {
			$(document)
				.off("keydown.Modal")
				.on("keydown.Modal", function (event) {
					if (event.keyCode === 27) {
						Modal.closeCurrent();
					}
				});
		}

	});

	$(document).on("close.Modal", function () {
		if (Modal.openModals.length === 0) {
			$(document).off("keydown.Modal");
		}
	});

	Sushi.Modal = Modal;
})(Sushi || (Sushi = {}));
