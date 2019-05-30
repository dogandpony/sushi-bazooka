/* ==============================================================================================
 * EVENTS
 * ============================================================================================== */

var Sushi;

(function (Sushi) {
	"use strict";

	var eventStack = new Map();

	var Events = function (target) {
		var EventHelper = function (target) {
			this.target = target;
		};

		var proto = EventHelper.prototype;

		proto.on = function (types, fn, options) {
			Events.on(types, this.target, fn, options);

			return this;
		};

		proto.one = function (types, fn, options) {
			Events.one(types, this.target, fn, options);

			return this;
		};

		proto.off = function (types, fn) {
			Events.off(types, this.target, fn);

			return this;
		};

		proto.trigger = function (types, data) {
			Events.trigger(types, this.target, data);

			return this;
		};

		return new EventHelper(target);
	};


	/**
	 * Parse targets and always return an array-like object
	 *
	 * @param target NodeList|HTMLCollection|Element
	 * @returns NodeList|HTMLCollection|Array
	 */
	var parseTargets = function (target) {
		target = target || null;

		if (Sushi.Dom.isIterable(target)) {
			return target;
		}
		else if ((target !== null) && (target.addEventListener !== void 0)) {
			return [target];
		}
		else {
			throw new TypeError(
				"The target parameter should be either an instance of Element, HTMLCollection,"
				+ " NodeList or any other element that can have listeners attached."
			);
		}
	};


	/**
	 * Adds multiple event listeners to a given element
	 *
	 * @private
	 * @param types String
	 * @param target Element
	 * @param fn Function
	 * @param options
	 */
	var addListeners = function (types, target, fn, options) {
		if (target === void 0) {
			throw Error("Target is undefined.");
		}

		var typeList = (typeof types === "string") ? types.split(" ") : types;

		if (!Array.isArray(typeList)) {
			throw Error("Types must be a string or an array.");
		}

		var events = eventStack.get(target);

		if (events === void 0) {
			eventStack.set(target, {});
			events = eventStack.get(target);
		}

		typeList.forEach(function (type) {
			var namespaceArray = type.split(".");

			events[type] = (events[type] || []);
			events[type].push({
				fn: fn,
				options: options,
			});

			while (namespaceArray.length > 0) {
				var typeString = namespaceArray.join(".");

				target.addEventListener(typeString, fn, options);

				namespaceArray.shift();
			}
		});
	};


	/**
	 * Removes multiple event listeners from a given target
	 *
	 * @private
	 * @param types String
	 * @param target Element
	 * @param fn Function
	 */
	var removeListeners = function (types, target, fn) {
		if (target === void 0) {
			throw Error("Target is undefined.");
		}

		var typeList = (typeof types === "string") ? types.split(" ") : types;

		if (!Array.isArray(typeList)) {
			throw Error("Types must be a string or an array.");
		}

		var events = eventStack.get(target);

		if (events === void 0) {
			return;
		}

		typeList.forEach(function (type) {
			var namespaceRegex = new RegExp(
				"(^|\\.)" + Sushi.Util.escapeRegExp(type) + "$"
			);

			Object.keys(events).forEach(function (namespace) {
				if (!namespaceRegex.test(namespace)) {
					return;
				}

				var j = events[namespace].length;

				while (j--) {
					var storedFunction = events[namespace][j].fn;

					if ((fn !== void 0) && (fn !== storedFunction)) {
						continue;
					}

					var namespaceArray = namespace.split(".");

					while (namespaceArray.length > 0) {
						var typeString = namespaceArray.join(".");

						target.removeEventListener(typeString, storedFunction);

						namespaceArray.shift();
					}

					events[namespace].splice(j, 1);
				}

				if (events[namespace].length === 0) {
					delete events[namespace];

					if (Object.keys(events).length === 0) {
						eventStack.delete(target);
					}
				}
			});
		});
	};


	/**
	 * Trigger multiple events in the given target
	 *
	 * @param types String
	 * @param target Element
	 * @param data Object
	 */
	var triggerEvents = function (types, target, data) {
		var typeList = types.split(" ");

		typeList.forEach(function (type) {
			var event;

			if (typeof window.CustomEvent === "function") {
				event = new window.CustomEvent(type, {
					detail: data,
					bubbles: true,
				});
			}
			else if (document.createEvent) {
				event = document.createEvent("CustomEvent");
				event.initCustomEvent(type, true, true, data);
			}

			event.eventName = type;

			target.dispatchEvent(event, data);
		});
	};


	/**
	 * Traverses the target list and invokes the selected private handler
	 *
	 * @param handler Function
	 * @param types String
	 * @param targets Element
	 * @param fn Function
	 * @param options
	 */
	var traverse = function (handler, types, targets, fn, options) {
		var elementList = parseTargets(targets);

		Array.prototype.slice.call(elementList).forEach(function (element) {
			if (Sushi.Dom.isIterable(element)) {
				traverse(handler, types, element, fn, options);
			}
			else {
				handler(types, element, fn, options);
			}
		});
	};


	/**
	 * Adds an event listener to one or more elements
	 *
	 * @param types String
	 * @param targets Element
	 * @param fn Function
	 * @param options
	 */
	Events.on = function (types, targets, fn, options) {
		traverse(addListeners, types, targets, fn, options);
	};


	/**
	 * Adds an event listener to be run only once on one or more elements
	 *
	 * @param types String
	 * @param targets Element
	 * @param fn Function
	 * @param options
	 */
	Events.one = function (types, targets, fn, options) {
		var oneFunction = function (event) {
			fn.call(this, event);
			traverse(removeListeners, types, this, oneFunction);
		};

		traverse(addListeners, types, targets, oneFunction, options);
	};


	/**
	 * Removes an event listener from one or more elements
	 *
	 * @param types String
	 * @param targets Element
	 * @param fn Function
	 */
	Events.off = function (types, targets, fn) {
		traverse(removeListeners, types, targets, fn);
	};


	Events.trigger = function (types, target, data) {
		traverse(triggerEvents, types, target, data);
	};


	Events.clone = function (target, clonedTarget) {
		var events = eventStack.get(target);

		Object.keys(events).forEach(function (eventType) {
			var eventStack = events[eventType];

			eventStack.forEach(function (event) {
				Events.on(eventType, clonedTarget, event.fn, event.options);
			});
		});
	};

	Events.getEventStack = function () {
		return eventStack;
	};

	Sushi.Events = Events;
})(Sushi || (Sushi = {}));
