/* =========================================================================
 * Body Scroll
 *
 * @TODO: receive caller IDs so there's a stack of locking elements
 * ========================================================================= */

var Sushi;

(function (Sushi) {
	"use strict";



	// DOM cache
	// ---------------------------

	var PAGE_WRAPPER = $("#pageWrapper");
	var HTML = $("html");

	var bodyScrollPosition;



	// Class definition
	// ---------------------------

	var BodyScroll = function () {};



	// Methods
	// ---------------------------

	/**
	 * Locks body scroll
	 * This is to be used primarily when a full-page scrolling overlay is visible, so the page
	 * scroll remains fixed as the user scrolls the overlay contents.
	 */
	BodyScroll.lock = function () {
		if ($("#sushiLockBodyScrollStyleTag").length === 0) {
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

			$("<style id=\"sushiLockBodyScrollStyleTag\">" + css + "</style>").appendTo("head");
		}

		bodyScrollPosition = window.scrollY;

		HTML.addClass("is-scroll-locked");

		PAGE_WRAPPER.css("margin-top", -1 * bodyScrollPosition);
	};


	/**
	 * Releases the scroll locked by Util.lockBodyScroll()
	 */
	BodyScroll.unlock = function () {
		PAGE_WRAPPER.css("margin-top", "");

		HTML.removeClass("is-scroll-locked");

		$(window).scrollTop(bodyScrollPosition);
	};


	Sushi.BodyScroll = BodyScroll;
})(Sushi || (Sushi = {}));
