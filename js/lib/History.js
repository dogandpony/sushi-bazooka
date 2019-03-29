var Sushi;

(function (Sushi) {
	"use strict";

	var Events = Sushi.Events;
	var Util = Sushi.Util;

	var History = function (options) {
		this.id = Util.uniqueId();

		this.options = Util.merge({}, History.DEFAULTS, options);

		this.isListening = false;

		this.validateOptions();
	};

	History.DEFAULTS = {
		type: "hash", // "hash", "pushState",
		hashPrefix: "#/",
		baseUrl: null,
		eventNamespace: null,
	};

	var proto = History.prototype;

	proto.constructor = History;

	proto.validateOptions = function () {
		if (this.options.baseUrl) {
			this.options.baseUrl = this.options.baseUrl.replace(/\/+$/, "");
		}

		if ((this.options.type === "pushState") && !this.options.baseUrl) {
			// eslint-disable-next-line no-console
			console.warn(
				"Option \"type\" is set to \"pushState\", but \"baseUrl\" was not set."
				+ " Type option will revert to \"hash\" instead."
			);

			this.options.navigation = "hash";
		}
	};

	proto.getEventName = function () {
		var eventName = (this.options.eventNamespace
				? this.options.eventNamespace
				: this.id + ".History"
		) + ".";

		switch (this.options.type) {
			default:
			case "hash":
				eventName = "hashchange";

				break;

			case "pushState":
				eventName = "popstate";
		}

		return eventName;
	};

	proto.on = function (callback) {
		if (this.isListening) {
			return;
		}

		if (typeof callback !== "function") {
			// eslint-disable-next-line no-console
			console.warn("No callback was provided to History.on().");

			return;
		}

		Events(window).on(this.getEventName(), callback);
	};

	proto.off = function () {
		if (!this.isListening) {
			return;
		}

		Events(window).off(this.getEventName());
	};

	proto.push = function (relativeUrl, data) {
		if (relativeUrl === void 0) {
			return;
		}

		// trim slashes
		relativeUrl = relativeUrl.replace(/^\/*(.*?)\/*$/gm, "$1");

		data = (data !== void 0) ? data : {};

		switch (this.options.type) {
			default:
			case "hash":
				window.location.hash = this.options.hashPrefix + relativeUrl;

				break;

			case "pushState":
				window.history.pushState(data, null, "/" + relativeUrl);

				var popStateEvent = new PopStateEvent("popstate", { state: data });

				dispatchEvent(popStateEvent);
		}
	};

	Sushi.History = History;
})(Sushi || (Sushi = {}));
