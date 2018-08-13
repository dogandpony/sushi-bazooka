/* ==============================================================================================
 * MODAL
 *
 * "What a fool believes"
 * ============================================================================================== */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var BasePlugin = Plugins.BasePlugin;
	var Dom = Sushi.Dom;
	var Events = Sushi.Events;
	var Util = Sushi.Util;

	var HTML_FACTORY = {
		CLOSE_BUTTON: "<a href=\"#!\" data-modal-trigger-close class=\"c-modal__close\"/>",
	};

	var MAIN_CONTAINER = Dom.parse("<div class=\"c-modals\">");

	var CENTERING_CLASSES = {
		CALCULATED_HORIZONTAL: "c-modalContainer--calculatedHCenter",
		CALCULATED_VERTICAL: "c-modalContainer--calculatedVCenter",
		HORIZONTAL: "c-modalContainer--hCenter",
		VERTICAL: "c-modalContainer--vCenter",
	};

	var Modal = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		this.isOpen = false;

		// Cache objects
		this.modal = Dom.get(this.options.modal);
		this.overlay = Dom.get(this.options.overlay);
		this.container = Dom.get(this.options.container);
		this.contentElement = Dom.get(this.options.content);

		Sushi.addPluginInstanceTo(this.modal, this);

		this.create();

		// Register click listener on triggering element
		if (this.options.registerClickListener) {
			Events(this.triggerElement).on("Modal.click", function (event) {
				event.preventDefault();

				this.toggle();
			}.bind(this));
		}
	};

	Modal.displayName = "Modal";

	Modal.DEFAULTS = {
		content: "",
		extraClasses: "",
		overlayExtraClasses: "",
		contentOperation: "copy",
		registerClickListener: true,
		insertCloseButton: true,
		lockScrollWhileOpen: false,
		populate: "onOpen", // "onCreate", false
		closeOnOverlayClick: true,
		closeOnEscape: true,
		size: "",

		// Centering
		horizontalCentering: true,
		verticalCentering: false,
		calculatedCentering: false,

		// Containers
		modal: "<div class=\"c-modal\">",
		overlay: "<div class=\"c-modalOverlay\">",
		container: "<div class=\"c-modalContainer\">",
	};

	Modal.openModals = [];

	Modal.prototype = Object.create(BasePlugin.prototype);

	var proto = Modal.prototype;

	proto.constructor = Modal;

	/**
	 * Create the modal and overlay HTML and append it to the body
	 */
	proto.create = function () {
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
			Dom.addClass(this.container, classes);
		}

		// Register overlay close listener
		if (this.options.closeOnOverlayClick) {
			Events(this.overlay).on("Modal.close.click", function (event) {
				if (event.target === this.container) {
					event.preventDefault();

					this.close();
				}
			}.bind(this));
		}

		// Pre-populate content, if enabled
		if (this.options.populate === "onCreate") {
			this.updateContent();
		}

		// Place elements on the main container
		Dom.addClass(this.modal, this.options.extraClasses);
		Dom.addClass(this.overlay, this.options.overlayExtraClasses);

		if (this.options.size !== "") {
			Dom.addClass(this.modal, "c-modal--" + this.options.size);
		}

		this.container.appendChild(this.modal);
		this.overlay.appendChild(this.container);
		this.mainContainer.appendChild(this.overlay);

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
	proto.createMainContainer = function () {
		this.mainContainer = Dom.get(this.options.mainContainer || MAIN_CONTAINER);

		if (this.mainContainer.parentNode) {
			document.body.appendChild(this.mainContainer);
		}
	};


	/**
	 * Show the modal
	 */
	proto.open = function () {
		this.isOpen = true;

		// Prevent body scroll if this is the only modal open
		if (this.options.lockScrollWhileOpen && Modal.openModals.length === 0) {
			Sushi.BodyScroll.lock(this.id);
		}

		this.addToOpenModalsList();

		if (this.options.populate === "onOpen") {
			this.updateContent();
		}

		// Force redraw so animations can take place
		window.getComputedStyle(this.modal).height;

		// Add a close button (if enabled)
		this.closeButton = Dom.get(HTML_FACTORY.CLOSE_BUTTON);

		if (this.options.insertCloseButton) {
			this.modal.prepend(this.closeButton);
		}

		// Register close button listener
		Events(Dom.get("[data-modal-trigger-close]", this.modal))
			.off("Modal.close.click")
			.on("Modal.close.click", function (event) {
				event.preventDefault();

				this.close();
			}.bind(this));

		// Show modal and overlay
		Dom.addClass(this.modal, "is-open");
		Dom.addClass(this.overlay, "is-open");

		// Trigger open events
		Events(this.modal).trigger("open Modal.open", { modal: this });

		if (Modal.openModals.length === 1) {
			Events(this.modal).trigger("Modal.first.open", { modal: this });
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
	proto.close = function () {
		this.isOpen = false;

		Dom.removeClass(this.modal, "is-open");
		Dom.removeClass(this.overlay, "is-open");

		var duration = Util.Css.getMaxTransitionDuration(this.modal);
		var overlayDuration = Util.Css.getMaxTransitionDuration(this.overlay);
		var maxDuration = Math.max(duration, overlayDuration, 0);

		this.removeFromOpenModalsList();

		Events(this.modal).trigger("close Modal.close", { modal: this });

		// Release body scroll if this is the last modal open
		if (Modal.openModals.length === 0) {
			if (this.options.lockScrollWhileOpen) {
				Sushi.BodyScroll.unlock(this.id);
			}

			Events(this.modal).trigger("Modal.last.close", { modal: this });
		}

		// @TODO: implement this with transitionend event
		setTimeout(function () {
			if (this.options.contentOperation === "move") {
				this.contentElement.appendChild(this.modal.children);
			}

			// Trigger closed event
			Events(this.modal).trigger("closed Modal.closed", { modal: this });
		}.bind(this), maxDuration);
	};


	proto.toggle = function () {
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
	proto.updateContent = function () {
		this.modal.html = "";

		switch (this.options.contentOperation) {
			default:
			case "copy":
				this.modal.innerHTML = this.contentElement.innerHTML;
				break;

			case "move":
				this.modal.appendChild(this.contentElement.children);
				break;
		}

		Events(this.modal).trigger("contentchange Modal.contentchange");
	};


	/**
	 * Update the modal position
	 */
	proto.updatePosition = function () {
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		var modalStyles = window.getComputedStyle(this.modal);
		var modalWidth = modalStyles.width;
		var modalHeight = modalStyles.height;

		if (this.options.horizontalCentering) {
			this.modal.style.marginLeft = (
				(windowWidth > modalWidth)
					? (-1 * Math.ceil(modalWidth / 2)) : (-1 * Math.ceil(windowWidth / 2))
			);
		}

		if (this.options.verticalCentering) {
			this.modal.style.marginTop = (
				(windowHeight > modalHeight)
					? (-1 * Math.ceil(modalHeight / 2)) : (-1 * Math.ceil(windowHeight / 2))
			);
		}
	};


	/**
	 * Add current modal to open modals list
	 */
	proto.addToOpenModalsList = function () {
		Modal.openModals.push(this);
	};


	/**
	 * Remove current modal from open modals list
	 */
	proto.removeFromOpenModalsList = function () {
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
	proto.enableCalculatedCentering = function () {
		Events(this.modal)
			.on("Modal.open", function () {
				Events(window).on(this.id + ".Modal.resize", function () {
					if (this.isOpen) {
						this.updatePosition();
					}
				});

				this.updatePosition();
			}.bind(this))
			.on("Modal.close", function () {
				Events(window).off(this.id + ".Modal.resize");
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



	/* Global listeners
	   --------------------------- */

	Events(document).on("Modal.open", function (event) {
		if (
			(event.detail != null)
			&& (event.detail.modal !== void 0)
			&& event.detail.modal.options.closeOnEscape
		) {
			Events(document)
				.off("Modal.keydown")
				.on("Modal.keydown", function (event) {
					if (event.keyCode === 27) {
						Modal.closeCurrent();
					}
				});
		}
	});

	Events(document).on("Modal.close", function () {
		if (Modal.openModals.length === 0) {
			Events(document).off("Modal.keydown");
		}
	});

	Plugins.Modal = Modal;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
