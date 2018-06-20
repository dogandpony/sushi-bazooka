/* =====================================================================
 * Sushi DOM library
 *
 * In regards to get(), getOne(), parse(), parseOne(), query()
 * and queryOne():
 * Please note that you should use native methods above all else. These
 * are just helper methods to use when you don't have a clue on what's
 * the input. For instance:
 *
 * - When you know the input is not an element, but you don't know if
 * it's a class or an ID selector: use Dom.query() or Dom.queryOne();
 * - When you don't know if the input is already an element or a string
 * selector: use Dom.get() or Dom.getOne().
 *
 * With that in mind, please note all those methods are at best 3 times
 * slower than their native counterparts, so it really pays off if you
 * filter the input beforehand and stick to the native methods.
 * ===================================================================== */

var Sushi;

(function (Sushi) {
	"use strict";

	var Dom = function () {};

	var traverseClassNames = function (target, method, classNames) {
		if (Dom.isIterable(target)) {
			for (var i = 0; i < target.length; i++) {
				Dom[method + "Class"](target[i], classNames);
			}
		}
		else {
			var classNamesArray = Array.isArray(classNames) ? classNames : classNames.split(" ");

			for (var j = 0; j < classNamesArray.length; j++) {
				var className = classNamesArray[j];

				if (className !== "") {
					target.classList[method](className);
				}
			}
		}
	};

	Dom.get = function (selector, context, onlyFirst) {
		if (selector instanceof HTMLElement) {
			if (onlyFirst === true) {
				return selector;
			}

			return [selector];
		}
		else if (typeof selector === "string") {
			selector = selector.trim();

			if (selector.indexOf("<") === 0) {
				return Dom.parse(selector, onlyFirst);
			}

			return Dom.query(selector, context, onlyFirst);
		}
	};

	Dom.getOne = function (selector, context) {
		return Dom.get(selector, context, true);
	};

	Dom.parse = function (html, onlyFirst) {
		html = html.trim();

		var firstTag = html.match(/<(.*?)[\s>]/)[1];
		var range = document.createRange();

		range.selectNode(document.getElementsByTagName(firstTag).item(0));

		var parent = range.createContextualFragment(html);

		return onlyFirst ? parent.firstChild : parent.children;
	};

	Dom.parseOne = function (html) {
		return Dom.parse(html, true);
	};

	Dom.query = function (selector, context, onlyFirst) {
		selector = selector.trim();
		context = context || document;
		onlyFirst = onlyFirst || false;

		var isSimpleSelector = (/[^a-zA-Z#.]/.test(selector) === false);

		var isIdSelector = (isSimpleSelector && (selector.indexOf("#") === 0));
		var isClassSelector = (isSimpleSelector && !isIdSelector && (selector.indexOf(".") === 0));
		var isTagSelector = (isSimpleSelector && !isIdSelector && !isClassSelector);

		if (onlyFirst === true) {
			if (isIdSelector) {
				return document.getElementById(selector.substring(1));
			}
			else if (isClassSelector) {
				return context.getElementsByClassName(selector.substring(1))[0] || null;
			}
			else if (isTagSelector) {
				return context.getElementsByTagName(selector)[0] || null;
			}

			return context.querySelector(selector);
		}
		else if (isIdSelector) {
			var collection;

			collection = document.getElementById(selector.substring(1));

			if (collection === null) {
				return [];
			}

			return [collection];
		}
		else if (isClassSelector) {
			return context.getElementsByClassName(selector.substring(1));
		}
		else if (isTagSelector) {
			return context.getElementsByTagName(selector);
		}

		return context.querySelectorAll(selector);
	};

	Dom.queryOne = function (selector, context) {
		return Dom.query(selector, context, true);
	};

	Dom.addClass = function (target, classNames) {
		traverseClassNames(target, "add", classNames);
	};

	Dom.removeClass = function (target, classNames) {
		traverseClassNames(target, "remove", classNames);
	};

	/**
	 * Checks if the target is either an instance of NodeList, HTMLCollection or Array
	 *
	 * @param target
	 * @returns {boolean}
	 */
	Dom.isIterable = function (target) {
		return (target instanceof NodeList)
			|| (target instanceof HTMLCollection)
			|| (target instanceof Array);
	};

	Sushi.Dom = Dom;
})(Sushi || (Sushi = {}));
