/* ==============================================================================================
 * DOM LIBRARY
 *
 * In regards to get(), getAll(), parse(), parseAll(), query()
 * and queryAll():
 * Please note that you should use native methods above all else. These
 * are just helper methods to use when you don't have a clue on what's
 * the input. For instance:
 *
 * - When you know the input is not an element, but you don't know if
 * it's a class or an ID selector: use Dom.query() or Dom.queryAll();
 * - When you don't know if the input is already an element or a string
 * selector: use Dom.get() or Dom.getAll().
 *
 * With that in mind, please note all those methods are at best 3 times
 * slower than their native counterparts, so it really pays off if you
 * filter the input beforehand and stick to the native methods.
 * ============================================================================================== */

var Sushi;

(function (Sushi) {
	"use strict";

	var Util = Sushi.Util;

	var Dom = function () {};

	var traverseClassNames = function (target, method, classNames) {
		if (!classNames) {
			return;
		}

		if (Dom.isIterable(target)) {
			for (var i = 0; i < target.length; i++) {
				Dom[method + "Class"](target[i], classNames);
			}
		}
		else {
			var classNamesArray = (Array.isArray(classNames)
				? classNames
				: classNames
					.replace(/[\t\n]/, " ")
					.replace(/\s+/, " ")
					.split(" ")
			);

			for (var j = 0; j < classNamesArray.length; j++) {
				var className = classNamesArray[j].trim();

				if (className !== "") {
					target.classList[method](className);
				}
			}
		}
	};

	/**
	 * @url https://gist.github.com/Munawwar/6e6362dbdf77c7865a99
	 *
	 * @param element
	 * @param context
	 * @returns {DocumentFragment}
	 */
	var parseHtmlUsingFragment = function (element, context) {
		context = context || document;

		var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
		var rtagName = /<([\w:]+)/;
		var rhtml = /<|&#?\w+;/;
		// We have to close these tags to support XHTML (#13200)
		var wrapMap = {
			// Support: IE9
			option: [1, "<select multiple=\"multiple\">", "</select>"],

			thead: [1, "<table>", "</table>"],
			col: [2, "<table><colgroup>", "</colgroup></table>"],
			tr: [2, "<table><tbody>", "</tbody></table>"],
			td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

			_default: [0, "", ""],
		};

		var tmp;
		var tag;
		var wrap;
		var j;
		var fragment = context.createDocumentFragment();

		if (!rhtml.test(element)) {
			fragment.appendChild(context.createTextNode(element));

			// Convert html into DOM nodes
		}
		else {
			tmp = fragment.appendChild(context.createElement("div"));

			// Deserialize a standard representation
			tag = (rtagName.exec(element) || ["", ""])[1].toLowerCase();
			wrap = wrapMap[tag] || wrapMap._default;
			tmp.innerHTML = wrap[1] + element.replace(rxhtmlTag, "<$1></$2>") + wrap[2];

			// Descend through wrappers to the right content
			j = wrap[0];

			while (j--) {
				tmp = tmp.lastChild;
			}

			// Remove wrappers and append created nodes to fragment
			fragment.removeChild(fragment.firstChild);

			while (tmp.firstChild) {
				fragment.appendChild(tmp.firstChild);
			}
		}

		return fragment;
	};

	Dom.getAll = function (selector, context, onlyOne) {
		if (selector instanceof HTMLElement) {
			if (onlyOne === true) {
				return selector;
			}

			return [selector];
		}
		else if (typeof selector === "string") {
			selector = selector.trim();

			if (selector.indexOf("<") === 0) {
				return onlyOne ? Dom.parse(selector) : Dom.parseAll(selector);
			}

			return Dom.queryAll(selector, context, onlyOne);
		}

		return null;
	};

	Dom.get = function (selector, context) {
		return Dom.getAll(selector, context, true);
	};

	Dom.parseAll = function (html, returnFragment) {
		returnFragment = returnFragment || false;

		var parent;

		if (window.HTMLTemplateElement === void 0) {
			parent = parseHtmlUsingFragment(html);
		}
		else {
			var templateElement = document.createElement("template");

			templateElement.innerHTML = html;

			parent = templateElement.content;
		}

		return returnFragment ? parent : parent.childNodes;
	};

	Dom.parse = function (html) {
		return Dom.parseAll(html).item(0);
	};

	Dom.queryAll = function (selector, context, onlyOne) {
		selector = selector.trim();
		context = context || document;
		onlyOne = onlyOne || false;

		var isDirectChildSelector = (selector.indexOf(">") === 0);

		if (isDirectChildSelector && (context instanceof HTMLElement)) {
			if (context.id === "") {
				context.id = Util.uniqueId("__sushi");
			}

			return Dom.queryAll("#" + context.id + " " + selector, document, onlyOne);
		}

		var isSimpleSelector = (/[\s\t\n\r>[='"]/.test(selector) === false);
		var isIdSelector = (isSimpleSelector && (selector.indexOf("#") === 0));
		var isClassSelector = (isSimpleSelector && !isIdSelector && (selector.indexOf(".") === 0));
		var isTagSelector = (isSimpleSelector && !isIdSelector && !isClassSelector);

		if (onlyOne === true) {
			if (isIdSelector) {
				return document.getElementById(selector.substring(1));
			}
			else if (isClassSelector) {
				return context.getElementsByClassName(selector.substring(1)).item(0);
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

	Dom.query = function (selector, context) {
		return Dom.queryAll(selector, context, true);
	};

	Dom.addClass = function (target, classNames) {
		traverseClassNames(target, "add", classNames);
	};

	Dom.removeClass = function (target, classNames) {
		traverseClassNames(target, "remove", classNames);
	};

	Dom.each = function (target, fn) {
		if (target instanceof HTMLElement) {
			target = [target];
		}

		if (Dom.isIterable(target)) {
			for (var i = 0; i < target.length; i++) {
				var element = target[i];

				fn.call(element);
			}
		}
	};


	/**
	 * Appends an arbitrary number of elements to a parent
	 *
	 * If you are appending a single element just use native .append() instead.
	 *
	 * @param {HTMLElement | Node | Array | NodeList | HTMLCollection} elements Elements to append
	 * @param {HTMLElement} parentElement Parent element where elements will be appended
	 *
	 * @return {void}
	 */
	Dom.append = function (elements, parentElement) {
		if (elements instanceof HTMLCollection) {
			elements = Array.prototype.slice.call(elements);
		}
		else {
			elements = Dom.isIterable(elements) ? elements : [elements];
		}

		var documentFragment = document.createDocumentFragment();

		elements.forEach(function (element) {
			documentFragment.appendChild(element);
		});

		parentElement.appendChild(documentFragment);
	};

	/**
	 * Clones a given target
	 *
	 * @param {HTMLElement | Node | Array} target Target to be cloned
	 * @param {Boolean} cloneEvents Whether or not to also clone events
	 * @returns {HTMLElement | Node | Array} Cloned target
	 */
	Dom.clone = function (target, cloneEvents) {
		cloneEvents = cloneEvents || false;

		var clonedTarget = null;

		if (Dom.isIterable(target)) {
			clonedTarget = [];

			for (var i = 0; i < target.length; i++) {
				var targetItem = target[i];

				clonedTarget.push(Dom.clone(targetItem));
			}
		}
		else {
			clonedTarget = target.cloneNode(true);

			if (cloneEvents === true) {
				var targetChildElements = Array.prototype.slice
					.call(target.getElementsByTagName("*"));
				var clonedChildElements = Array.prototype.slice
					.call(clonedTarget.getElementsByTagName("*"));

				targetChildElements.forEach(function (element, index) {
					Sushi.Events.clone(element, clonedChildElements[index]);
				});

				Sushi.Events.clone(target, clonedTarget);
			}
		}

		return clonedTarget;
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
