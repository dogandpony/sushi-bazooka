var Sushi;

(function (Sushi, root) {
	"use strict";

	var Util = Sushi.Util;

	var Math = function () {};


	/**
	 * Rounds numbers in a way to prevent oddities like window.Math.round(1.005*100)/100 returning 1
	 * instead of 1.01
	 *
	 * @param value
	 * @param decimals
	 * @returns {number}
	 */
	Math.round = function (value, decimals) {
		decimals = decimals || 0;

		value = value.toFixed(decimals + 1);

		return Number(root.Math.round(value + "e" + decimals) + "e-" + decimals);
	};


	Math.average = function () {
		var sum = 0;
		var average = null;

		if (arguments.length > 0) {
			for (var i = 0; i < arguments.length; i++) {
				sum += arguments[i];
			}

			average = sum / arguments.length;
		}

		return average;
	};


	/**
	 * Returns a random number between min (inclusive) and max (exclusive)
	 */
	Math.randomFloat = function (min, max) {
		return root.Math.random() * (max - min) + min;
	};


	/**
	 * Returns a random integer between min (inclusive) and max (inclusive)
	 * Using window.Math.round() will give you a non-uniform distribution!
	 */
	Math.randomInt = function (min, max) {
		return root.Math.floor(root.Math.random() * (max - min + 1)) + min;
	};


	Math.pad = function (number, length) {
		var padString = "";
		var numberLength = Math.getLength(number);
		var maxPad = root.Math.max(length, numberLength);

		for (var i = 0; i < maxPad; i++) {
			padString += "0";
		}

		return (padString + number).slice(-1 * maxPad);
	};


	/**
	 * @url https://stackoverflow.com/a/10952773
	 * @param number
	 * @returns {number}
	 */
	Math.getLength = function (number) {
		return root.Math.ceil(root.Math.log(number + 1) / root.Math.LN10);
	};


	/* Trigonometry
	   ===================================================================== */

	Math.getClosestPathBetween = function (origin, destination, length) {
		var clockwise = 0;
		var counterClockwise = 0;

		if (origin < destination) {
			clockwise = (destination - origin);
			counterClockwise = (origin + length - destination);
		}
		else if (origin > destination) {
			counterClockwise = (origin - destination);
			clockwise = (destination + length - origin);
		}

		var distance = root.Math.min(clockwise, counterClockwise);

		if (
			(distance !== 0)
			&& (clockwise !== counterClockwise)
			&& (distance === counterClockwise)
		) {
			distance = distance * -1;
		}

		return distance;
	};


	/**
	 * Converts a number to its hexadecimal counterpart
	 *
	 * @param x
	 * @returns {string}
	 */
	Math.toHex = function (x) {
		return ("0" + parseInt(x).toString(16)).slice(-2);
	};


	/**
	 * Currently only works with two-dimensional coordinates
	 */
	Math.constrainPointTo = function (coordinates, minLimit, maxLimit, center) {
		center = center || {
			x: 0,
			y: 0,
		};

		var clonedCoordinates = {
			x: coordinates.x - center.x,
			y: coordinates.y - center.y,
		};

		var radius = Math.hypot(clonedCoordinates.x, clonedCoordinates.y);

		if (minLimit) {
			radius = root.Math.max(radius, minLimit);
		}

		if (maxLimit) {
			radius = root.Math.min(radius, maxLimit);
		}

		var radians = root.Math.atan2(clonedCoordinates.x, clonedCoordinates.y);

		return {
			x: radius * root.Math.sin(radians) + center.x,
			y: radius * root.Math.cos(radians) + center.y,
		};
	};


	Math.polarToCartesian = function (center, radius, angleInDegrees) {
		var angleInRadians = (angleInDegrees * (root.Math.PI / 180.0));

		return {
			x: center.x + (radius * root.Math.cos(angleInRadians)),
			y: center.y + (radius * root.Math.sin(angleInRadians)),
		};
	};


	Math.getPointAngle = function (point, origin) {
		origin = origin || {
			x: 0,
			y: 0,
		};

		return root.Math.atan2((point.x - origin.x), (point.y - origin.y));
	};


	Math.getPointAngleInDegrees = function (point, origin) {
		return Math.getPointAngle(point, origin) * (180 / root.Math.PI);
	};


	Math.translatePoint = function (coordinates, angleInDegrees, origin) {
		origin = origin || {};
		origin.x = origin.x || 0;
		origin.y = origin.y || 0;

		var radians = angleInDegrees * (root.Math.PI / 180.0);
		var cos = root.Math.cos(radians);
		var sin = root.Math.sin(radians);
		var deltaX = coordinates.x - origin.x;
		var deltaY = coordinates.y - origin.y;

		return {
			x: Math.round(cos * deltaX - sin * deltaY + origin.x, 6),
			y: Math.round(sin * deltaX + cos * deltaY + origin.y, 6),
		};
	};


	Math.hypot = root.Math.hypot || function () {
		var y = 0;
		var i = arguments.length;

		while (i--) {
			y += arguments[i] * arguments[i];
		}

		return root.Math.sqrt(y);
	};

	Util.Math = Math;
})(Sushi || (Sushi = {}), this);
