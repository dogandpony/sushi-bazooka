var Sushi;

(function (Sushi) {
	"use strict";

	var Events = Sushi.Events;
	var Util = Sushi.Util;

	var Toast = function (message, options) {
		this.message = message;
		this.options = Util.merge({}, Toast.DEFAULTS, options);

		this.duration = Math.max(
			Math.min(
				(message.length * this.options.durationPerCharacter),
				this.options.maxDuration
			),
			this.options.minDuration
		);

		this.prepare();
	};

	Toast.DEFAULTS = {
		durationPerCharacter: 80,
		minDuration: 2000,
		maxDuration: 7000,
		className: "",
		autoDismiss: true,
		addCloseButton: false,
		closeButtonClassName: "",
	};

	var proto = Toast.prototype;

	proto.prepare = function () {
		this.bread = document.createElement("div");

		this.bread.classList.add("o-toaster__toast");

		if (this.options.className) {
			var classNames = this.options.className.split(" ");

			if (classNames) {
				for (var i = 0; i < classNames.length; i++) {
					this.bread.classList.add(classNames[i]);
				}
			}
		}

		if (this.options.autoDismiss === false) {
			this.bread.classList.add("o-toaster__toast--sticky");
		}

		this.bread.innerHTML = this.message;

		if (this.options.addCloseButton === true) {
			this.createCloseButton();
		}
	};

	proto.createCloseButton = function () {
		var closeButtonElement = document.createElement("i");

		closeButtonElement.classList.add("o-toaster__toastCloseButton");

		if (this.options.closeButtonClassName) {
			var classNames = this.options.className.split(" ");

			if (classNames) {
				for (var i = 0; i < classNames.length; i++) {
					closeButtonElement.classList.add(classNames[i]);
				}
			}
		}

		this.bread.appendChild(closeButtonElement);

		Events(closeButtonElement).on("click", function (event) {
			event.preventDefault();

			this.toaster.clean(this);
		}.bind(this));
	};

	Sushi.Toast = Toast;
})(Sushi || (Sushi = {}));
