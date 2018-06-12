var Sushi;

/**
 * Easing Functions - inspired on http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 *
 * @url https://gist.github.com/gre/1650294
 */
(function (Sushi) {

	"use strict";

	var Util = Sushi.Util;

	var Easing = function () {};


	/**
	 * No easing, no acceleration
	 */
	Easing.linear = function (t) {
		return t;
	};


	/**
	 * Accelerating from zero velocity
	 */
	Easing.easeInQuad = function (t) {
		return t * t;
	};


	/**
	 * Decelerating to zero velocity
	 */
	Easing.easeOutQuad = function (t) {
		return t * (2 - t);
	};


	/**
	 * Acceleration until halfway, then deceleration
	 */
	Easing.easeInOutQuad = function (t) {
		return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	};


	/**
	 * Accelerating from zero velocity
	 */
	Easing.easeInCubic = function (t) {
		return t * t * t;
	};


	/**
	 * Decelerating to zero velocity
	 */
	Easing.easeOutCubic = function (t) {
		return (--t) * t * t + 1;
	};


	/**
	 * Acceleration until halfway, then deceleration
	 */
	Easing.easeInOutCubic = function (t) {
		return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
	};


	/**
	 * Accelerating from zero velocity
	 */
	Easing.easeInQuart = function (t) {
		return t * t * t * t;
	};


	/**
	 * Decelerating to zero velocity
	 */
	Easing.easeOutQuart = function (t) {
		return 1 - (--t) * t * t * t;
	};


	/**
	 * Acceleration until halfway, then deceleration
	 */
	Easing.easeInOutQuart = function (t) {
		return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
	};


	/**
	 * Accelerating from zero velocity
	 */
	Easing.easeInQuint = function (t) {
		return t * t * t * t * t;
	};


	/**
	 * Decelerating to zero velocity
	 */
	Easing.easeOutQuint = function (t) {
		return 1 + (--t) * t * t * t * t;
	};


	/**
	 * Acceleration until halfway, then deceleration
	 */
	Easing.easeInOutQuint = function (t) {
		return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
	};


	Util.Easing = Easing;

})(Sushi || (Sushi = {}));
