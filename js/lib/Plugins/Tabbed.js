/* ==============================================================================================
 * TABBED
 *
 * How to use:
 * - Create a markup like this:
 *   <div class="c-tabbed" data-plugin="Tabbed">
 *     <ul class="c-tabbed__nav o-inlineList">
 *       <li class="c-tabbed__navItem o-inlineList__item is-active" data-tab="1">
 *         <a href="#!" class="c-tabbed__navLink">Tab #1</a>
 *       </li>
 *       <li class="c-tabbed__navItem o-inlineList__item" data-tab="2">
 *         <a href="#!" class="c-tabbed__navLink">Tab #2</a>
 *       </li>
 *     </ul>
 *     <div class="c-tabbed__tabs">
 *       <div class="c-tabbed__tab" data-tab="1">
 *         Tab #1 content
 *       </div>
 *       <div class="c-tabbed__tab" data-tab="2">
 *         Tab #2 content
 *       </div>
 *     </div>
 *   </div>
 * ============================================================================================== */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var BasePlugin = Plugins.BasePlugin;
	var Dom = Sushi.Dom;
	var Events = Sushi.Events;

	var Tabbed = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		var navElement = triggerElement.getElementsByClassName("c-tabbed__nav")[0];
		var tabContainer = triggerElement.getElementsByClassName("c-tabbed__tabs")[0];

		this.navItems = navElement.getElementsByClassName("c-tabbed__navItem");
		this.navLinks = navElement.getElementsByClassName("c-tabbed__navLink");
		this.tabs = tabContainer.getElementsByClassName("c-tabbed__tab");

		this.registerListeners();
	};

	Tabbed.displayName = "Tabbed";

	Tabbed.DEFAULTS = {};

	function onNavLinkClick(event) {
		var navItem = event.target.closest(".c-tabbed__navItem");

		Dom.removeClass(this.navItems, "is-active");

		navItem.classList.add("is-active");

		for (var i = 0; i < this.tabs.length; i++) {
			var tab = this.tabs[i];

			if (tab.dataset.tab === navItem.dataset.tab) {
				tab.classList.add("is-active");
			}
			else {
				tab.classList.remove("is-active");
			}
		}
	}

	Tabbed.prototype = Object.create(BasePlugin.prototype);

	var proto = Tabbed.prototype;

	proto.constructor = Tabbed;

	proto.registerListeners = function () {
		Events(this.navLinks).on("Tabbed.click", onNavLinkClick.bind(this));
	};

	Plugins.Tabbed = Tabbed;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
