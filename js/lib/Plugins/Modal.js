/* ==============================================================================================
 * MODAL
 *
 * How To Use
 * Create an element and add data-plugin="Modal" to it. A click listener will be registered to that
 * element if it exists in the page.
 *
 * Options
 * - content: HTMLElement or selector string to be used in the modal content. It may be moved or
 *   copied depending on the `contentOperation` option.
 * - contentOperation: How to handle the content passed by the `content` option. Defaults to `copy`.
 *   Available options:
 *   - `copy` (default): copies the content to the modal. This operation does not copy events that
 *     might be registered throughout the content elements.
 *   - `move`: Moves the entire content element to the modal. This will also move all events that
 *     might be registered throughout the content elements. Only works if the parsed value of the
 *     `content` option is an HTMLElement (i.e. not an HTMLCollection or NodeList).
 * - lockScroll: Makes the modal lock the page scroll while open. Defaults to `false`.
 * - closeOnOverlayClick: Makes the modal close itself when the overlay is clicked. Defaults to
 *   `true`.
 * - closeOnEscape: Makes the modal close itself when the Escape key is hit. Defaults to `true`.
 * - extraClasses: Array or space-separated list of classes to be applied to the class list of the
 *   modal element.
 * - populate: Changes the moment when the modal content is populated. Defaults to `onCreate`.
 *   Available options:
 *   - `onCreate` (default): Populates the modal once, at modal markup creation.
 *   - `onOpen`: Populates the modal every time it's open. Useful for dynamic content.
 *   - `false`: Never populates the modal. Useful for pre-rendered modals.
 * - horizontalCentering: Whether to horizontally center the modal or not. Defaults to `true`.
 * - verticalCentering: Whether to vertically center the modal or not. Defaults to `false`.
 * - template: HTML string, selector string or HTMLElement to be used as the modal template. If it
 *   is an HTMLElement it will be appended to the element set in `appendTo` option.
 * - appendTo: Container to append the modal to. Set to `false` to not move the modal if it is
 *   already in the page.
 *
 * Tips
 * - I want to create a modal that can't be closed
 *   A modal can't close if there are no elements with "data-modal-close" attribute inside it and if
 *   the `closeOnEscape` option is set to `false`.
 * - I want to use a pre-rendered modal markup
 *   1. Set the `template` option to a selector or the actual pre-rendered HTML string.
 *   2. Set the `appendTo` option to `false` if you'd like the modal element to stay where it is.
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

	var CENTERING_MODIFIERS = {
		horizontal: "hCenter",
		vertical: "vCenter",
	};

	var parseTarget = function (target) {
		var element = Dom.get(target);

		if (
			(element !== null)
			&& ["script", "template"].includes(element.tagName.toLowerCase())
		) {
			element = Dom.parseAll(element.innerHTML);
		}

		return element;
	};

	var Modal = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		this.isOpen = false;

		// Cache objects
		var template = parseTarget(this.options.template);

		this.element = template.classList.contains("c-modal")
			? template
			: template.getElementsByClassName("c-modal").item(0)
		;
		this.overlay = this.element.getElementsByClassName("c-modal__overlay").item(0);
		this.content = this.element.getElementsByClassName("c-modal__content").item(0);

		this.contentSource = parseTarget(this.options.content);
		this.appendTo = Dom.get(this.options.appendTo);

		this.validateOptions();

		Sushi.addPluginInstanceTo(this.element, this);

		this.create();

		// Register click listener on triggering element
		if (this.triggerElement.parentElement !== null) {
			Events(this.triggerElement).on("Modal.click", function (event) {
				event.preventDefault();

				this.toggle();
			}.bind(this));
		}
	};

	Modal.displayName = "Modal";

	Modal.DEFAULTS = {
		content: "",
		contentOperation: "copy",
		lockScroll: false,
		closeOnOverlayClick: true,
		closeOnEscape: true,
		extraClasses: "",
		populate: "onOpen", // "onCreate", false

		// Centering
		horizontalCentering: true,
		verticalCentering: false,

		// Containers
		template: ""
			+ "<div class=\"c-modal\">"
			+ "    <div class=\"c-modal__overlay\">"
			+ "        <div class=\"c-modal__contentWrapper\">"
			+ "            <div class=\"c-modal__content\"></div>"
			+ "            <a href=\"#!\" class=\"c-modal__close\" data-modal-close></a>"
			+ "        </div>"
			+ "    </div>"
			+ "</div>",
		appendTo: document.body,
	};

	Modal.openModals = [];

	Modal.prototype = Object.create(BasePlugin.prototype);

	var proto = Modal.prototype;

	proto.constructor = Modal;

	proto.validateOptions = function () {
		if (
			(this.options.contentOperation === "move")
			&& !(this.contentSource instanceof HTMLElement)
		) {
			// eslint-disable-next-line no-console
			console.warn(
				this.constructor.displayName + " doesn't support the \"move\" content operation"
				+ " when the content is not an HTMLElement.\nPlease wrap your content within a tag"
				+ " or add data-modal-content=\"outer\" attribute to the tag you are using.\nThe"
				+ " content operation will be set to \"copy\"."
			);

			this.options.contentOperation = "copy";
		}
	};

	/**
	 * Create the modal and overlay HTML and append it to the body
	 */
	proto.create = function () {
		var classes = [];

		if (this.options.horizontalCentering) {
			classes.push("c-modal--" + CENTERING_MODIFIERS.horizontal);
		}

		if (this.options.verticalCentering) {
			classes.push("c-modal--" + CENTERING_MODIFIERS.vertical);
		}

		classes = classes.concat(this.options.extraClasses);

		Dom.addClass(this.element, classes);

		if (this.element.parentElement === null) {
			this.appendTo.appendChild(this.element);
		}

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

		if (this.element.classList.contains("is-open")) {
			this.open();
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
					this.constructor.displayName + " is set to lock scroll while open but Sushi's"
					+ " BodyScroll class does not exist.\nPage scroll will not be locked."
				);
			}
		}

		this.addToOpenModalsList();

		if (this.options.populate === "onOpen") {
			this.updateContent();
		}

		// Force redraw so animations can take place
		window.getComputedStyle(this.element).height;

		// Register close button listener
		Events(this.element.querySelectorAll("[data-modal-close]"))
			.off("Modal.close.click")
			.on("Modal.close.click", function (event) {
				event.preventDefault();

				this.close();
			}.bind(this));

		// Show modal and overlay
		Dom.addClass(this.element, "is-open");

		// Trigger open events
		Events(this.element).trigger("open", { modal: this });
	};


	/**
	 * Hide the modal
	 */
	proto.close = function () {
		this.isOpen = false;

		Dom.removeClass(this.element, "is-open");

		var duration = Util.Css.getMaxTransitionDuration(this.element);
		var overlayDuration = Util.Css.getMaxTransitionDuration(this.overlay);
		var maxDuration = Math.max(duration, overlayDuration, 0);

		this.removeFromOpenModalsList();

		Events(this.element).trigger("close", { modal: this });

		// Release body scroll if this is the last modal open
		if (Modal.openModals.length === 0) {
			if (this.options.lockScrollWhileOpen) {
				Sushi.BodyScroll.unlock(this.id);
			}
		}

		// @TODO: implement this with transitionend event
		setTimeout(function () {
			if (this.options.populate === "onOpen") {
				this.clearContent();

				if (this.options.contentOperation === "move") {
					this.contentSourcePlaceholder
						.insertAdjacentElement("afterend", this.contentSource);
					this.contentSourcePlaceholder.remove();
				}
			}

			// Trigger closed event
			Events(this.element).trigger("closed", { modal: this });
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
		this.content.innerHTML = "";

		switch (this.options.contentOperation) {
			default:
			case "copy":
				Dom.append(Dom.clone(this.contentSource, true), this.content);

				break;

			case "move":
				if (this.options.populate === "onOpen") {
					this.contentSourcePlaceholder = document.createElement("div");
					this.contentSourcePlaceholder.dataset.modalContentPlaceholder = "";

					this.contentSource
						.insertAdjacentElement("afterend", this.contentSourcePlaceholder);
				}

				Dom.append(this.contentSource, this.content);

				break;
		}

		Events(this.element).trigger("contentchange");
	};


	/**
	 * Clears the modal
	 */
	proto.clearContent = function () {
		this.content.innerHTML = "";

		Events(this.element).trigger("contentchange");
	};


	/**
	 * Update the modal position
	 */
	proto.updatePosition = function () {
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		var modalStyles = window.getComputedStyle(this.content);
		var modalWidth = modalStyles.width;
		var modalHeight = modalStyles.height;

		if (this.options.horizontalCentering) {
			this.content.style.marginLeft = (
				(windowWidth > modalWidth)
					? (-1 * Math.ceil(modalWidth / 2)) : (-1 * Math.ceil(windowWidth / 2))
			);
		}

		if (this.options.verticalCentering) {
			this.content.style.marginTop = (
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
