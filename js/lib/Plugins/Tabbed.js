/* ==============================================================================================
 * TABBED
 *
 * How to use:
 * - Create a markup like this:
 *   <div class="c-tabbed" data-plugin="Tabbed">
 *     <div class="c-tabbed__navContainer">
 *       <ul class="c-tabbed__nav o-inlineList">
 *         <li class="c-tabbed__navItem o-inlineList__item is-active" data-tab="1">
 *           <a href="#!" class="c-tabbed__navLink">Tab #1</a>
 *         </li>
 *         <li class="c-tabbed__navItem o-inlineList__item" data-tab="2">
 *           <a href="#!" class="c-tabbed__navLink">Tab #2</a>
 *         </li>
 *       </ul>
 *     </div>
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
	var Events = Sushi.Events;

	var Tabbed = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		this.validateOptions();

		var navElement = triggerElement.getElementsByClassName("c-tabbed__nav").item(0);
		var tabContainer = triggerElement.getElementsByClassName("c-tabbed__tabs").item(0);

		this.navItems = navElement.getElementsByClassName("c-tabbed__navItem");
		this.navLinks = navElement.getElementsByClassName("c-tabbed__navLink");
		this.tabs = tabContainer.getElementsByClassName("c-tabbed__tab");

		this.history = new Sushi.History({
			type: this.options.navigationType,
			baseUrl: this.options.baseUrl,
		});

		this.activateTab(this.parseSlugFromUrl());
		this.registerListeners();
	};

	Tabbed.displayName = "Tabbed";

	Tabbed.DEFAULTS = {
		navigationType: "hash", // "hash", "pushState", null
		baseUrl: null,
	};

	function onNavLinkClick(event) {
		if (this.options.navigationType !== null) {
			event.preventDefault();
		}

		var navItem = event.target.closest(".c-tabbed__navItem");

		this.history.push(navItem.dataset.tab);
	}

	Tabbed.prototype = Object.create(BasePlugin.prototype);

	var proto = Tabbed.prototype;

	proto.constructor = Tabbed;

	proto.validateOptions = function () {
		if ((this.options.navigationType === "pushState") && !this.options.baseUrl) {
			// eslint-disable-next-line no-console
			console.warn(
				"Option \"navigationType\" is set to \"pushState\", but \"baseUrl\" was not set."
				+ " Navigation Type option will revert to \"hash\" instead."
			);

			this.options.navigationType = "hash";
		}

		return true;
	};

	proto.registerListeners = function () {
		this.history.on(function () {
			this.activateTab(this.parseSlugFromUrl());
		}.bind(this));

		Events(this.navLinks).on(this.id + ".Tabbed.click", onNavLinkClick.bind(this));
	};

	proto.parseSlugFromUrl = function () {
		if (this.options.navigationType === null) {
			return null;
		}

		if (this.options.navigationType === "hash") {
			return window.location.hash.toString().replace(/^#\/(.*)$/, "$1");
		}
		else if (this.options.navigationType === "pushState") {
			return window.location.toString().replace(this.options.baseUrl + "/", "");
		}
	};

	proto.activateTab = function (slug) {
		if (!slug) {
			return;
		}

		for (var i = 0; i < this.tabs.length; i++) {
			var tab = this.tabs[i];

			if (tab.dataset.tab === slug) {
				tab.classList.add("is-active");
			}
			else {
				tab.classList.remove("is-active");
			}
		}

		for (var j = 0; j < this.navItems.length; j++) {
			var navItem = this.navItems[j];

			if (navItem.dataset.tab === slug) {
				navItem.classList.add("is-active");
			}
			else {
				navItem.classList.remove("is-active");
			}
		}
	};

	Plugins.Tabbed = Tabbed;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
