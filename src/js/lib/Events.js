var Sushi;

(function (Sushi) {
	"use strict";

	var eventStack = [];

	var Events = function (target) {
		return new Events.EventHelper(target);
	};


	/**
	 * Returns the stored target event data, also setting it up if it doesn't exist
	 *
	 * @param target
	 * @returns {*}
	 */
	var getStoredTarget = function (target) {
		var storedTarget;
		var index = null;

		if (target !== void 0) {
			for (var i = 0; i < eventStack.length; i++) {
				if (target === eventStack[i].target) {
					index = i;
					break;
				}
			}

			if (index === null) {
				eventStack.push({
					target: target,
					events: {},
				});

				index = (eventStack.length - 1);
			}

			storedTarget = eventStack[index];
			storedTarget.index = index;
		}

		return storedTarget;
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
	 */
	var addListeners = function (types, target, fn) {
		var typeList = types.split(" ");
		var storedTarget = getStoredTarget(target);

		for (var i = 0; i < typeList.length; i++) {
			var namespaceArray = typeList[i].split(".");

			storedTarget.events[typeList[i]] = storedTarget.events[typeList[i]] || [];
			storedTarget.events[typeList[i]].push(fn);

			while (namespaceArray.length > 0) {
				var typeString = namespaceArray.join(".");

				storedTarget.target.addEventListener(typeString, fn);

				namespaceArray.shift();
			}
		}
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
		var typeList = types.split(" ");
		var storedTarget = getStoredTarget(target);

		if (storedTarget !== void 0) {
			for (var i = 0; i < typeList.length; i++) {
				var typeString = typeList[i];
				var type = typeString.split(".").pop();
				var namespaceRegex = new RegExp(typeString + "$");

				for (var namespace in storedTarget.events) {
					if (storedTarget.events.hasOwnProperty(namespace)
						&& namespaceRegex.test(namespace)) {
						var j = storedTarget.events[namespace].length;

						while (j--) {
							var storedFunction = storedTarget.events[namespace][j];

							if ((fn !== void 0) && (fn !== storedFunction)) {
								continue;
							}

							storedTarget.target.removeEventListener(type, storedFunction);
							storedTarget.events[namespace].splice(j, 1);
						}

						if (storedTarget.events[namespace].length === 0) {
							delete storedTarget.events[namespace];

							if (Object.keys(storedTarget.events).length === 0) {
								eventStack.splice(storedTarget.index, 1);
							}
						}
					}
				}
			}
		}
		else {
			throw Error("Target is undefined.");
		}
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

		for (var i = 0; i < typeList.length; i++) {
			var event;
			var eventName = typeList[i];

			if (typeof window.CustomEvent === "function") {
				event = new window.CustomEvent(eventName, { detail: data });
			}
			else if (document.createEvent) {
				event = document.createEvent("CustomEvent");
				event.initCustomEvent(eventName, true, true, data);
			}

			event.eventName = eventName;

			target.dispatchEvent(event, data);
		}
	};


	/**
	 * Traverses the target list and invokes the selected private handler
	 *
	 * @param handler Function
	 * @param types String
	 * @param targets Element
	 * @param fn Function
	 */
	var traverse = function (handler, types, targets, fn) {
		var elementList = parseTargets(targets);

		for (var i = 0; i < elementList.length; i++) {
			var element = elementList[i];

			if (Sushi.Dom.isIterable(element)) {
				traverse(handler, types, element, fn);
			}
			else {
				handler(types, element, fn);
			}
		}
	};


	/**
	 * Adds an event listener to one or more elements
	 *
	 * @param types String
	 * @param targets Element
	 * @param fn Function
	 */
	Events.on = function (types, targets, fn) {
		traverse(addListeners, types, targets, fn);
	};


	/**
	 * Adds an event listener to be run only once on one or more elements
	 *
	 * @param types String
	 * @param targets Element
	 * @param fn Function
	 */
	Events.one = function (types, targets, fn) {
		var oneFunction = function () {
			fn.call(this);
			traverse(removeListeners, types, this, oneFunction);
		};

		traverse(addListeners, types, targets, oneFunction);
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
		var storedTarget = getStoredTarget(target);
		var registeredEvents = storedTarget.events;

		for (var eventType in registeredEvents) {
			if (registeredEvents.hasOwnProperty(eventType)) {
				var functionStack = registeredEvents[eventType];

				for (var i = 0; i < functionStack.length; i++) {
					var fn = functionStack[i];

					Events.on(eventType, clonedTarget, fn);
				}
			}
		}
	};


	Events.getEventStack = function () {
		return eventStack;
	};

	Sushi.Events = Events;
})(Sushi || (Sushi = {}));
