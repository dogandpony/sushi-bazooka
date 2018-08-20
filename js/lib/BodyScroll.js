/* ==============================================================================================
 * BODY SCROLL
 *
 * @TODO: receive caller IDs so there's a stack of locking elements
 * ============================================================================================== */

var Sushi;

(function (Sushi) {
	"use strict";

	var bodyScrollPosition;

	var BodyScroll = {};

	BodyScroll.pageWrapper = "#pageWrapper";

	/**
	 * Locks body scroll
	 * This is to be used primarily when a full-page scrolling overlay is visible, so the page
	 * scroll remains fixed as the user scrolls the overlay contents.
	 *
	 * @return {void}
	 */
	BodyScroll.lock = function () {
		if (document.getElementById("sushiLockBodyScrollStyleTag") === null) {
			var scrollbarWidth = Sushi.Util.getScrollbarWidth();

			var css = ""
				+ ".is-scroll-locked,"
				+ ".is-scroll-locked body {"
				+ "   position: fixed !important;"
				+ "   overflow: hidden !important;"
				+ "   height: 100% !important;"
				+ "   width: 100% !important;"
				+ "}"
				+ ""
				+ ".is-scroll-locked body {"
				+ "   padding-right:" + scrollbarWidth + "px !important;"
				+ "}";

			var styleElement = Sushi.Dom.parse(
				"<style id=\"sushiLockBodyScrollStyleTag\">" + css + "</style>"
			);

			document.head.appendChild(styleElement);
		}

		bodyScrollPosition = window.pageYOffset;

		document.documentElement.classList.add("is-scrollLocked");

		Sushi.Dom.get(BodyScroll.pageWrapper).style.marginTop = (-1 * bodyScrollPosition) + "px";
	};


	/**
	 * Releases the scroll locked by Util.lockBodyScroll()
	 *
	 * @return {void}
	 */
	BodyScroll.unlock = function () {
		Sushi.Dom.get(BodyScroll.pageWrapper).style.marginTop = "";

		document.documentElement.classList.remove("is-scrollLocked");

		window.scrollTo(window.pageXOffset, bodyScrollPosition);
	};

	Sushi.BodyScroll = BodyScroll;
})(Sushi || (Sushi = {}));
