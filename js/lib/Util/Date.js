/* ==============================================================================================
 * DATE UTILS
 * ============================================================================================== */

var Sushi;

(function (Sushi, root) {
	"use strict";

	var Util = Sushi.Util;

	var Date = function () {};


	/**
	 * Returns the first second of the week
	 *
	 * @param date
	 * @returns {Date}
	 */
	Date.getStartOfTheWeek = function (date) {
		date = new root.Date(date);

		var day = date.getDay();
		var diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday

		date.setHours(0, 0, 0, 0);

		return new root.Date(date.setDate(diff));
	};


	/**
	 * Returns the last second of the week
	 *
	 * @param date
	 * @returns {Date}
	 */
	Date.getEndOfTheWeek = function (date) {
		date = new root.Date(Date.getStartOfTheWeek(date));

		date.setDate(date.getDate() + 6);
		date.setHours(23, 59, 59, 999);

		return date;
	};


	/**
	 * Returns the first second of the month
	 *
	 * @param date
	 * @returns {Date}
	 */
	Date.getStartOfTheMonth = function (date) {
		date = new root.Date(date);

		date.setHours(0, 0, 0, 0);

		return new root.Date(date.setDate(1));
	};


	/**
	 * Returns the last second of the month
	 *
	 * @param date
	 * @returns {Date}
	 */
	Date.getEndOfTheMonth = function (date) {
		date = new root.Date(date);

		date.setMonth(date.getMonth() + 1);
		date.setDate(0);
		date.setHours(23, 59, 59, 999);

		return new root.Date(date);
	};


	Util.Date = Date;
})(Sushi || (Sushi = {}), this);
