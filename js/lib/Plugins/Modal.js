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

	var CENTERING_MODIFIERS = {
		calculatedHorizontal: "calculatedHCenter",
		calculatedVertical: "calculatedVCenter",
		horizontal: "hCenter",
		vertical: "vCenter",
	};

	var Modal = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		this.isOpen = false;

		// Cache objects
		this.modal = Dom.get(this.options.modal);
		this.overlay = Dom.get(this.options.overlay);
		this.contentContainer = Dom.get(this.options.contentContainer);
		this.contentElement = Dom.get(this.options.content);
		this.appendTo = Dom.get(this.options.appendTo);

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
		overlay: "<div class=\"c-modal__overlay\">",
		contentContainer: "<div class=\"c-modal__content\">",
		appendTo: document.body,
	};

	Modal.openModals = [];

	Modal.prototype = Object.create(BasePlugin.prototype);

	var proto = Modal.prototype;

	proto.constructor = Modal;

	/**
	 * Create the modal and overlay HTML and append it to the body
	 */
	proto.create = function () {
		var classes = [];

		if (this.options.calculatedCentering) {
			if (this.options.horizontalCentering) {
				classes.push("c-modal--" + CENTERING_MODIFIERS.calculatedHorizontal);
			}

			if (this.options.verticalCentering) {
				classes.push("c-modal--" + CENTERING_MODIFIERS.calculatedVertical);
			}
		}
		else {
			if (this.options.horizontalCentering) {
				classes.push("c-modal--" + CENTERING_MODIFIERS.horizontal);
			}

			if (this.options.verticalCentering) {
				classes.push("c-modal--" + CENTERING_MODIFIERS.vertical);
			}
		}

		if (this.options.size !== "") {
			classes.push("c-modal--" + this.options.size);
		}

		classes = classes.concat(this.options.extraClasses);

		Dom.addClass(this.modal, classes);

		// Register overlay close listener
		if (this.options.closeOnOverlayClick) {
			Events(this.overlay).on("Modal.close.click", function (event) {
				if (event.target === this.overlay) {
					event.preventDefault();

					this.close();
				}
			}.bind(this));
		}

		// Pre-populate content, if enabled
		if (this.options.populate === "onCreate") {
			this.updateContent();
		}

		if (this.contentContainer.parent !== this.overlay) {
			this.overlay.appendChild(this.contentContainer);
		}

		if (this.overlay.parent !== this.modal) {
			this.modal.appendChild(this.overlay);
		}

		if (this.modal.parent !== this.appendTo) {
			this.appendTo.appendChild(this.modal);
		}

		// Only register listeners that call updatePosition() if the modal does horizontal or
		// vertical auto-centering
		if (this.options.calculatedCentering
			&& (this.options.horizontalCentering || this.options.verticalCentering)) {
			this.enableCalculatedCentering();
		}
	};


	/**
	 * Show the modal
	 */
	proto.open = function () {
		this.isOpen = true;

		// Prevent body scroll if this is the only modal open
		if (this.options.lockScrollWhileOpen && Modal.openModals.length === 0) {
			if (Sushi.BodyScroll !== void 0) {
				Sushi.BodyScroll.lock(this.id);
			}
			else {
				// eslint-disable-next-line no-console
				console.warn(
					"Modal is set to lock scroll while open but Sushi's BodyScroll class does"
					+ " not exist."
				);
			}
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
			this.contentContainer.append(this.closeButton);
		}

		// Register close button listener
		Events(Dom.getAll("[data-modal-trigger-close]", this.modal))
			.off("Modal.close.click")
			.on("Modal.close.click", function (event) {
				event.preventDefault();

				this.close();
			}.bind(this));

		// Show modal and overlay
		Dom.addClass(this.modal, "is-open");

		// Trigger open events
		Events(this.modal).trigger("open Modal.open", { modal: this });

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
		}

		// @TODO: implement this with transitionend event
		setTimeout(function () {
			if (this.options.contentOperation === "move") {
				this.contentElement.appendChild(this.modal.children);
			}

			if (this.options.populate === "onOpen") {
				this.clearContent();
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
				this.contentContainer.innerHTML = this.contentElement.innerHTML;
				break;

			case "move":
				this.contentContainer.appendChild(this.contentElement.children);
				break;
		}

		Events(this.modal).trigger("contentchange Modal.contentchange");
	};


	/**
	 * Clears the modal
	 */
	proto.clearContent = function () {
		this.modal.html = "";

		Events(this.modal).trigger("contentchange Modal.contentchange");
	};


	/**
	 * Update the modal position
	 */
	proto.updatePosition = function () {
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		var modalStyles = window.getComputedStyle(this.contentContainer);
		var modalWidth = modalStyles.width;
		var modalHeight = modalStyles.height;

		if (this.options.horizontalCentering) {
			this.contentContainer.style.marginLeft = (
				(windowWidth > modalWidth)
					? (-1 * Math.ceil(modalWidth / 2)) : (-1 * Math.ceil(windowWidth / 2))
			);
		}

		if (this.options.verticalCentering) {
			this.contentContainer.style.marginTop = (
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
