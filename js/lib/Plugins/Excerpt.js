/* ==============================================================================================
 * EXCERPT
 *
 * Based on Adam Hooper's Excerpt utility:
 * https://github.com/adamhooper/bodacity-js-util/blob/master/src/jquery.excerpt.js
 *
 * Ensures an element's text is cut off at a certain maximum number of lines.
 *
 * The element must have a nonzero width when empty. (Most commonly a block element, such as a <p>,
 * will fit this criterion). The contained HTML-free text will be truncated to fit the width along
 * with an "end", e.g., '…'. Truncation will only occur along whitespace.
 *
 * Assumptions:
 * - The element is empty or contains only a single text node.
 *
 * Guarantees:
 * - The displayed text will never surpass the requested number of lines.
 * - If truncation occurs and the end string fits within the width of the element, the end string
 *   will be displayed.
 * - As many words in the element's text will be displayed as possible.
 *
 * Options:
 * - end: (default `…`) String to append to the end when truncating.
 * - alwaysAppendEnd: (default `true`) If true, the `end` string will always be appended to the
 *   excerpt. Please note this may actually cause truncation which would otherwise not occur.
 * - lines: (default `1`) Number of lines of text to display.
 * - autoUpdate: (default `true`) Whether or not to update the text on window resize. Uses
 *   `updateThreshold` to throttle the execution of the update function.
 *
 * "Every now and then I fall apart"
 * ============================================================================================== */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var BasePlugin = Plugins.BasePlugin;
	var Events = Sushi.Events;
	var Util = Sushi.Util;

	var Excerpt = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		this.originalText = this.triggerElement.innerText;

		this.endString = this.options.end;
		this.endElement = document.createTextNode(this.endString);

		this.update();

		if (this.options.autoUpdate) {
			this.registerListeners();
		}
	};

	Excerpt.displayName = "Excerpt";

	Excerpt.DEFAULTS = {
		end: "…",
		alwaysAppendEnd: false,
		lines: 1,
		autoUpdate: true,
		updateThreshold: 100,
	};

	Excerpt.prototype = Object.create(BasePlugin.prototype);

	var proto = Excerpt.prototype;

	proto.constructor = Excerpt;


	/*
	 * Resets the element based on its original text, such that it only the
	 * desired number of lines are shown and there is no overflow.
	 */
	proto.update = function () {
		// Element is empty
		if (this.triggerElement.firstChild === null) {
			return;
		}

		var dimensions = this.getDimensions();

		var string = this.originalText.replace(/\s+/, " ");

		var spaces = []; // Array of indices to space characters

		spaces.push(0);

		for (var i = 1; i < string.length; i++) {
			if (string.charAt(i) == " ") {
				spaces.push(i);
			}
		}

		spaces.push(string.length);

		var leftBound = 0;
		var rightBound = spaces.length - 1;

		var cursor = 0;
		var cutoff = 100;

		while (leftBound < rightBound && cutoff) {
			cursor = Math.floor(leftBound + (rightBound - leftBound) / 2);

			if (cursor == leftBound) {
				cursor += 1;
			}

			var sub = this.substring(string, spaces[cursor]);

			if (this.isStringSmallEnough(sub, dimensions.width, dimensions.height)) {
				leftBound = cursor;
			}
			else {
				rightBound = cursor - 1;
			}

			cutoff -= 1;
		}

		this.triggerElement.firstChild.nodeValue = this.substring(string, spaces[leftBound], true);

		if ((string.length !== spaces[leftBound]) || this.alwaysAppendEnd) {
			this.triggerElement.appendChild(this.endElement);
		}
	};


	proto.registerListeners = function () {
		Events(window).on(
			this.id + ".Excerpt.resize",
			Util.throttle(this.update.bind(this), this.options.updateThreshold)
		);
	};


	/*
	 * Returns the element dimensions in px.
	 *
	 * Modifies this.element contents as a side-effect.
	 */
	proto.getDimensions = function () {
		var tempString = "&nbsp;";

		for (var i = 0; i < (this.options.lines - 1); i++) {
			tempString += "<br style='display:block!important' />&nbsp;";
		}

		this.triggerElement.innerHTML = tempString;

		var dimensions = {
			width: this.triggerElement.offsetWidth,
			height: this.triggerElement.offsetHeight,
		};

		this.triggerElement.innerHTML = "&nbsp;"; // anything non-empty

		return dimensions;
	};


	proto.substring = function (string, length, excludeEndString) {
		if (length === string.length) {
			return string;
		}

		var subString = string.substr(0, length);

		if (excludeEndString) {
			return subString;
		}
		else {
			return subString + this.endString + (this.endString || "");
		}
	};


	proto.isStringSmallEnough = function (string, width, height) {
		this.triggerElement.firstChild.nodeValue = string;

		return (
			(this.triggerElement.offsetHeight <= height)
			&& (this.triggerElement.offsetWidth <= width)
		);
	};

	Plugins.Excerpt = Excerpt;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
