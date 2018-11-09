/* ==============================================================================================
 * GENERAL UTILS
 * ============================================================================================== */

var Sushi;

(function (Sushi) {
	"use strict";

	var Util = {};


	/**
	 * Stores the unique ID index used by Util.uniqueId()
	 * @type {number}
	 */
	var uniqueIdIndex = 0;


	/**
	 * Runs a function only once every {wait} number of times
	 *
	 * @param {function} func Function to run
	 * @param {number} wait Amount of milliseconds to wait between triggers
	 * @param {object} options Object that receives `leading` and `trailing` boolean properties to
	 * run the function before the first trigger and after the last trigger, respectively.
	 * @returns {function} Function that has just ran
	 */
	Util.throttle = function (func, wait, options) {
		var timeout, context, args, result;
		var previous = 0;

		if (!options) {
			options = {};
		}

		/**
		 * Runs after the throttling ends
		 *
		 * @returns {void}
		 */
		var later = function () {
			previous = options.leading === false ? 0 : new Date().getTime();
			timeout = null;
			result = func.apply(context, args);

			if (!timeout) {
				context = args = null;
			}
		};

		/**
		 * Throttling function container
		 *
		 * @returns {void}
		 */
		var throttled = function () {
			var now = new Date().getTime();

			if (!previous && options.leading === false) {
				previous = now;
			}

			var remaining = wait - (now - previous);

			context = this;
			args = arguments;

			if (remaining <= 0 || remaining > wait) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				previous = now;
				result = func.apply(context, args);
				if (!timeout) {
					context = args = null;
				}
			}
			else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}

			return result;
		};

		throttled.cancel = function () {
			clearTimeout(timeout);
			previous = 0;
			timeout = context = args = null;
		};

		return throttled;
	};


	/**
	 * Returns a pseudo-unique id
	 *
	 * @param {string} prefix Optional prefix to add to the ID string
	 * @returns {string} Unique ID
	 */
	Util.uniqueId = function (prefix) {
		return (prefix || "") + uniqueIdIndex++;
	};


	/**
	 * Returns an array of properties that begin with a given namespace
	 *
	 * @param {string} namespace Property namespace (or prefix) to look for
	 * @param {object} properties Object of properties to look into
	 * @returns {object} Object of filtered properties that match the namespace
	 */
	Util.getNamespaceProperties = function (namespace, properties) {
		var namespaceProperties = {};
		var namespaceCheckRegExp = new RegExp("^" + namespace + "(([A-Z]+).*?)$");

		for (var i in properties) {
			if (properties.hasOwnProperty(i) && namespaceCheckRegExp.test(i)) {
				var val = properties[i];
				var shortName = i.match(namespaceCheckRegExp)[1]
					.replace(/^[A-Z]/, function (string) {
						return (string || "").toLowerCase();
					});

				namespaceProperties[shortName] = val;
			}
		}

		return namespaceProperties;
	};


	/**
	 * Returns a single transition end event supported by the current browser
	 *
	 * @returns {string} First supported transition end event name
	 */
	Util.getTransitionEndEvent = function () {
		var element = document.createElement("i");

		var transitions = {
			transition: "transitionend",
			OTransition: "oTransitionEnd",
			MozTransition: "transitionend",
			WebkitTransition: "webkitTransitionEnd",
		};

		for (var i in transitions) {
			if (element.style[i] !== undefined) {
				return transitions[i];
			}
		}
	};


	/**
	 * Returns the vertical scrollbar width
	 * Please note this function is costly because it generates a repaint every time it runs.
	 *
	 * @return {number} Width of the scrollbar in pixels
	 */
	Util.getScrollbarWidth = function () {
		var scrollDiv = document.createElement("div");

		document.body.appendChild(scrollDiv);

		scrollDiv.style.width = "100px";
		scrollDiv.style.height = "100px";
		scrollDiv.style.overflow = "scroll";
		scrollDiv.style.position = "absolute";
		scrollDiv.style.top = "-9999px";

		// Get the scrollbar width
		var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

		// Delete the DIV
		document.body.removeChild(scrollDiv);

		return scrollbarWidth;
	};


	/**
	 * Returns the first available Request Animation Frame function in the current browser or a
	 * timeout based on the `fps` property
	 *
	 * @param {function} fn Function to run on the animation frame
	 * @param {number} fps Desired FPS to run the timeout function. It may not be the actual FPS if
	 * the browser can't handle it. Defaults to `60`.
	 * @return {void}
	 */
	Util.requestAnimationFrame = function (fn, fps) {
		fps = fps || 60;

		var animationFrameFunction = window.requestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| function (fn) {
				return setTimeout(fn, 1000 / fps);
			};

		return animationFrameFunction(fn);
	};


	/**
	 * Cancels the requested animation frame
	 *
	 * @param {number} requestId Option timeout ID to cancel
	 * @return {void}
	 */
	Util.cancelAnimationFrame = function (requestId) {
		var animationFrameFunction = window.cancelAnimationFrame
			|| window.mozCancelAnimationFrame
			|| function (requestId) {
				clearTimeout(requestId);
			};

		return animationFrameFunction(requestId);
	};


	/**
	 * Simple utility that deep merges data-only objects
	 *
	 * Please note: if you need advanced features such as merging of accessors this is not the right
	 * tool for the job.
	 *
	 * @param {object} target Object to merge other arguments into
	 * @returns {object} Merged object
	 */
	Util.deepMerge = function (target) {
		for (var i = 1; i < arguments.length; i++) {
			var obj = arguments[i];

			if (!obj) {
				continue;
			}

			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (Util.isMergeableObject(obj[key])) {
						target[key] = Util.merge(target[key] || {}, obj[key]);
					}
					else {
						target[key] = obj[key];
					}
				}
			}
		}

		return target;
	};


	/**
	 * Alias/Polyfill for Object.assign()
	 *
	 * @param {object} target Object to merge other arguments into
	 * @returns {object} Merged object
	 */
	Util.merge = function (target) {
		if (Object.assign) {
			return Object.assign.apply({}, arguments);
		}
		else {
			if (target === undefined || target === null) {
				throw new TypeError("Cannot convert undefined or null to object");
			}

			var to = Object(target);

			for (var i = 1; i < arguments.length; i++) {
				var nextSource = arguments[i];

				if (nextSource === undefined || nextSource === null) {
					continue;
				}

				nextSource = Object(nextSource);

				var keysArray = Object.keys(Object(nextSource));

				for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
					var nextKey = keysArray[nextIndex];
					var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

					if (desc !== undefined && desc.enumerable) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}

			return to;
		}
	};


	/**
	 * Returns true if the target object is mergeable
	 *
	 * @param {object} target Object to test
	 * @returns {boolean} True if the object is mergeable
	 */
	Util.isMergeableObject = function (target) {
		var nonNullObject = target && typeof target === "object";

		return nonNullObject
			&& Object.prototype.toString.call(target) !== "[object RegExp]"
			&& Object.prototype.toString.call(target) !== "[object Date]";
	};


	/**
	 * Converts first character of a string to upper case and returns the new string
	 *
	 * @param {string} string String to be changed
	 * @returns {string} Changed string
	 */
	Util.firstCharacterToUpperCase = function (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};


	/**
	 * Converts first character of a string to lower case and returns the new string
	 *
	 * @param {string} string String to be changed
	 * @returns {string} Changed string
	 */
	Util.firstCharacterToLowerCase = function (string) {
		return string.charAt(0).toLowerCase() + string.slice(1);
	};


	/**
	 * Retrieves data from a form element
	 *
	 * @param {HTMLElement} formElement Form tag to grab field data from
	 * @param {boolean} ignoreEmpty Whether to ignore empty fields or not. Defaults to true.
	 * @returns {object} Object with the form's field data
	 */
	Util.getFormData = function (formElement, ignoreEmpty) {
		ignoreEmpty = (ignoreEmpty !== void 0) ? ignoreEmpty : true;

		var formData = {};

		for (var i = 0; i < formElement.elements.length; i++) {
			var inputElement = formElement.elements[i];

			if ((inputElement.type === "radio")) {
				if (!ignoreEmpty || inputElement.checked) {
					formData[inputElement.name] = inputElement.value;
				}
			}
			else if ((inputElement.type === "checkbox") && inputElement.checked) {
				if (!ignoreEmpty || inputElement.checked) {
					(formData[inputElement.name] || (formData[inputElement.name] = []));
					formData[inputElement.name].push(inputElement.value);
				}
			}
			else if (!ignoreEmpty || (inputElement.value !== "")) {
				formData[inputElement.name] = inputElement.value;
			}
		}

		return formData;
	};


	/**
	 * Forces the repaint of an element by querying its computed style
	 *
	 * @param {HTMLElement} element Element to force repaint
	 * @returns {void}
	 */
	Util.forceRepaint = function (element) {
		window.getComputedStyle(element).height;
	};


	/**
	 * Escapes a string to use it in Regular Expressions
	 *
	 * @param {string} string String to escape
	 * @returns {string} Escaped string
	 */
	Util.escapeRegExp = function (string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
	};


	/**
	 * Turns a string or array of modifiers into an array of classes using the `mainClass` parameter
	 *
	 * @param {string} mainClass Main component class
	 * @param {string|array} modifiers Array of modifiers
	 * @param {string} separator Modifier separator (defaults to `--`)
	 *
	 * @return {array} Array of modifier classes
	 */
	Util.getModifierClasses = function (mainClass, modifiers, separator) {
		separator = (separator || "--");

		if (typeof modifiers === "string") {
			modifiers = modifiers.replace(/[\s,;]+?/g, " ");
			modifiers = modifiers.split(" ");
		}

		for (var i = 0; i < modifiers.length; i++) {
			modifiers[i] = mainClass + separator + modifiers[i];
		}

		return modifiers;
	};


	/**
	 * Returns the current breakpoint based on the value of the content property in the :before
	 * pseudo-element of the body tag.
	 *
	 * @return {string} Current breakpoint name
	 */
	Util.getCurrentBreakpoint = function () {
		return window.getComputedStyle(document.body, ":before")
			.getPropertyValue("content")
			.replace(/["']/g, "");
	};

	Sushi.Util = Util;
})(Sushi || (Sushi = {}));
