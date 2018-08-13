/* ==============================================================================================
 * TOASTER
 * ============================================================================================== */

var Sushi;

(function (Sushi) {
	"use strict";

	var Css = Sushi.Util.Css;
	var Events = Sushi.Events;
	var Util = Sushi.Util;


	var Toaster = function (options) {
		options = options || {};

		this.options = Util.merge({}, Toaster.DEFAULTS, options);

		this.queue = [];
		this.isCooking = false;

		this.place();
	};


	Toaster.DEFAULTS = {
		container: document.body,
		position: "center bottom",
		stacked: false, // implies sequential pop-up if false, shows all at once if true
	};


	var proto = Toaster.prototype;


	/**
	 * Creates the toaster element and appends it to the options.container
	 */
	proto.place = function () {
		var positionArray = this.options.position.split(" ");

		this.toasterElement = document.createElement("div");

		this.toasterElement.classList.add("c-toaster");

		if (this.options.stacked === true) {
			this.toasterElement.classList.add("c-toaster--stacked");
		}

		for (var i = 0; i < positionArray.length; i++) {
			var position = positionArray[i];

			this.toasterElement.classList.add("c-toaster--" + position);
		}

		this.options.container.appendChild(this.toasterElement);
	};


	proto.addToast = function (toast) {
		if (toast instanceof Sushi.Toast) {
			this.enqueue(toast);

			// force repaint
			window.getComputedStyle(toast.bread).height;

			this.cook();
		}
		else {
			new TypeError("toast should be an instance of Toast");
		}
	};


	/**
	 * Shows the next toast notification, if there are no toasts being shown or if this is a stacked
	 * toaster (this.options.stacked === true)
	 */
	proto.cook = function () {
		if ((this.options.stacked === true) || (this.isCooking === false)) {
			this.isCooking = true;

			var toast = this.queue.shift();

			toast.bread.classList.remove("is-next");
			toast.bread.classList.add("is-cooked");

			var fadeInDuration = Css.getMaxTransitionDuration(toast.bread);

			toast.cookingTime = (fadeInDuration + toast.duration);

			Events(toast.bread).trigger("open", {toast: toast});

			if (toast.options.autoDismiss === true) {
				this.scheduleAutoDismiss(toast);
			}
		}
	};


	proto.scheduleAutoDismiss = function (toast) {
		setTimeout(function () {
			this.isCooking = false;
			this.dismiss(toast);
		}.bind(this), toast.cookingTime);
	};


	proto.dismiss = function (toast) {
		toast.bread.classList.remove("is-cooked");

		var fadeOutDuration = Css.getMaxTransitionDuration(toast.bread);

		setTimeout(function () {
			if (this.queue.length > 0) {
				this.cook();
			}

			Events(toast.bread).trigger("close", {toast: toast});

			this.clean(toast);
		}.bind(this), fadeOutDuration);
	};


	proto.enqueue = function (toast) {
		this.queue.push(toast);

		toast.toaster = this;
		toast.bread.classList.add("is-next");

		this.toasterElement.insertBefore(toast.bread, this.toasterElement.childNodes[0]);
	};


	proto.clean = function (toast) {
		this.toasterElement.removeChild(toast.bread);
	};


	Sushi.Toaster = Toaster;
})(Sushi || (Sushi = {}));
