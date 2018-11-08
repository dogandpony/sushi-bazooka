/* ==============================================================================================
 * SELECT
 * ============================================================================================== */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var BasePlugin = Plugins.BasePlugin;
	var Dom = Sushi.Dom;
	var Events = Sushi.Events;
	var Dropdown = Plugins.Dropdown;
	var Util = Sushi.Util;

	function getOptionLabel(optionElement) {
		return optionElement.title || optionElement.label;
	}

	var Select = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		this.filters = {};

		this.isMultiple = (this.triggerElement.getAttribute("multiple") !== null);

		if (this.options.hideSelected) {
			this.filters.selected = false;
		}

		if (this.options.hideNull) {
			this.filters.null = false;
		}

		this.create();
		this.registerListeners();
	};

	Select.displayName = "Select";

	Select.DEFAULTS = {
		bare: false,
		hideSelected: false,
		hideNull: false,
		extraClasses: "",
		multipleSeparator: ", ",
		search: false,
	};

	Select.prototype = Object.create(BasePlugin.prototype);

	var proto = Select.prototype;

	proto.constructor = Select;

	proto.create = function () {
		this.containerElement = Dom.parse("<div class='c-select'>");

		this.buttonElement = Dom.parse(
			"<button class='c-select__button' type='button'>"
		);

		this.triggerElement.classList.add("c-select__select");
		this.triggerElement.setAttribute("tabindex", "-99");

		if (this.options.bare) {
			this.containerElement.classList.add("c-select--bare");
		}

		this.createDropdown();

		// Add the container after the select
		this.triggerElement.parentNode.insertBefore(
			this.containerElement,
			this.triggerElement.nextSibling
		);

		// Move the select to the container
		this.containerElement.appendChild(this.triggerElement);

		this.dropdown = new Dropdown(this.containerElement, {
			triggerEvent: "click",
			closeOnSelect: !this.isMultiple,
			closeIntentionTimeout: 0,
		});
	};

	proto.createDropdown = function () {
		this.dropdownElement = Dom.parse("<div class='c-select__dropdown c-dropdown'>");
		this.dropdownListElement = Dom.parse("<ul class='c-select__list'>");

		this.updateItems();

		if (this.options.search) {
			this.createSearch();
		}

		// Append new elements
		this.dropdownElement.appendChild(this.dropdownListElement);
		this.containerElement.appendChild(this.buttonElement);
		this.containerElement.appendChild(this.dropdownElement);

		if (this.options.extraClasses) {
			Dom.addClass(this.dropdownElement, this.options.extraClasses);
			Dom.addClass(this.buttonElement, this.options.extraClasses);
		}
	};

	proto.createSearch = function () {
		var searchInputContainer = document.createElement("div");

		searchInputContainer.classList.add("c-select__search");

		this.searchInput = document.createElement("input");
		this.searchInput.classList.add("c-select__searchInput");

		searchInputContainer.appendChild(this.searchInput);
		this.dropdownElement.appendChild(searchInputContainer);
	};

	proto.registerListeners = function () {
		Events(this.triggerElement)
			.on("Select.change", this.updateSelectedOptions.bind(this));

		Events(this.buttonElement)
			.on("Select.focus", this.enableKeyDownListener.bind(this))
			.on("Select.blur", this.disableKeyDownListener.bind(this));

		Events(this.dropdown.triggerElement)
			.on("Select.open", this.handleDropdownOpen.bind(this))
			.on("Select.close", this.disableKeyDownListener.bind(this));

		if (this.options.search) {
			Events(this.searchInput)
				.on("Select.keydown", this.handleSearchInputUpdate.bind(this))
				.on("Select.click", function (event) {
					event.stopPropagation();
				});
		}
	};

	proto.enableKeyDownListener = function () {
		Events(document)
			.off("Select.keydown")
			.on("Select.keydown", this.handleKeyDown.bind(this));
	};

	proto.disableKeyDownListener = function () {
		if (!this.dropdown.isOpen) {
			Events(document).off("Select.keydown");
		}
	};

	proto.handleDropdownOpen = function () {
		var currentItem = (
			Dom.query(".c-select__item.is-active", this.dropdownListElement)
			|| Dom.query(".c-select__item", this.dropdownListElement)
		);

		setTimeout(function () {
			currentItem.focus();
		}, Util.Css.getMaxTransitionDuration(this.dropdownElement));
	};

	/**
	 *
	 * Tab: 9
	 * Enter: 13
	 * ESC: 27
	 * Space: 32
	 * Arrow Up: 38
	 * Arrow Down: 40
	 *
	 * @param event
	 */
	proto.handleKeyDown = function (event) {
		if (([9, 13, 27, 32, 38, 40].indexOf(event.keyCode) === -1)) {
			return;
		}

		if (this.dropdown.isOpen) {
			var activeElement = document.activeElement;

			event.preventDefault();

			switch (event.keyCode) {
				// esc
				case 27:
					this.dropdown.close();
					this.buttonElement.focus();

					break;

				// arrow up
				case 38:
					(activeElement.previousSibling || activeElement.parentNode.lastChild).focus();

					break;

				// arrow down
				case 40:
					(activeElement.nextSibling || activeElement.parentNode.firstChild).focus();

					break;

				// tab, enter or space
				case 9:
				case 13:
				case 32:
					if (this.isMultiple) {
						var itemElement = activeElement.closest(".c-select__item");
						var checkboxElement = Dom.query(
							".c-select__checkbox",
							itemElement
						);

						checkboxElement.checked = !checkboxElement.checked;

						Events(checkboxElement).trigger("change");
					}
					else {
						Events(activeElement.closest(".c-select__item")).trigger("click");
						this.buttonElement.focus();
					}

					break;
			}
		}
		// space, arrow up and arrow down open the select
		else if ([38, 40, 32].indexOf(event.keyCode) !== -1) {
			event.preventDefault();

			this.dropdown.open();
		}
	};

	/**
	 * Handles clicks in dropdown items
	 *
	 * Expects the current styled select to be single.
	 *
	 * @param event
	 */
	proto.handleItemClick = function (event) {
		var itemElement = event.target.closest(".c-select__item");
		var itemValue = itemElement.dataset.value;
		var selectedOption = this.triggerElement.selectedOptions[0];

		if ((itemValue !== void 0) && (itemValue !== selectedOption.value)) {
			this.triggerElement.value = itemValue;

			Events(this.triggerElement).trigger("change");
		}
	};

	proto.handleCheckboxChange = function (event) {
		var itemElement = event.target.closest(".c-select__item");
		var itemValue = itemElement.dataset.value;
		var optionElement = Dom.query("option[value='" + itemValue + "']", this.triggerElement);
		var checkboxElement = Dom.query(
			".c-select__checkbox",
			itemElement
		);

		optionElement.selected = checkboxElement.checked;

		itemElement.focus();

		this.updateSelectedOptions();
	};

	proto.handleSearchInputUpdate = function () {
		setTimeout(function () {
			this.filters.search = this.searchInput.value;
			this.filterItems();
		}.bind(this), 0);
	};

	proto.registerItemListeners = function () {
		if (this.isMultiple) {
			Events(Dom.queryAll(".c-select__checkbox", this.dropdownListElement))
				.on("select.change", this.handleCheckboxChange.bind(this));
		}
		else {
			Events(Dom.queryAll(".c-select__item", this.dropdownListElement))
				.on("select.click", this.handleItemClick.bind(this));
		}
	};

	proto.updateItems = function () {
		var childElements = this.triggerElement.children;
		var dropdownChildrenFragment = document.createDocumentFragment();

		Events(this.dropdownListElement.getElementsByClassName("c-select__item"))
			.off("Select.click");

		this.groups = [];
		this.dropdownItems = [];

		for (var i = 0; i < childElements.length; i++) {
			var itemElement;
			var childElement = childElements[i];
			var elementTag = childElement.tagName.toLowerCase();

			if (elementTag === "optgroup") {
				itemElement = this.createGroup(childElement);
				this.groups.push(itemElement);
			}
			else if (elementTag === "option") {
				itemElement = this.createItem(childElement);
				this.dropdownItems.push(itemElement);
			}

			dropdownChildrenFragment.appendChild(itemElement);
		}

		this.dropdownListElement.innerHTML = "";
		this.dropdownListElement.appendChild(dropdownChildrenFragment);

		this.updateSelectedOptions();
		this.registerItemListeners();
	};

	proto.createGroup = function (groupElement) {
		var groupItemElement = document.createElement("li");
		var titleElement = document.createElement("div");
		var options = groupElement.getElementsByTagName("option");
		var listElement = document.createElement("ul");

		titleElement.classList.add("c-select__groupLabel");
		titleElement.innerHTML = groupElement.label;

		listElement.classList.add("c-select__list");
		listElement.classList.add("c-select__list--group");

		groupItemElement.classList.add("c-select__group");
		groupItemElement.appendChild(titleElement);

		for (var i = 0; i < options.length; i++) {
			var optionElement = options[i];
			var itemElement = this.createItem(optionElement);

			itemElement.classList.add("c-select__item--group");

			listElement.appendChild(itemElement);

			this.dropdownItems.push(itemElement);
		}

		groupItemElement.appendChild(listElement);

		return groupItemElement;
	};

	proto.createItem = function (optionElement) {
		var title;
		var itemElement = document.createElement("li");
		var titleElement;

		if (optionElement.dataset.title !== void 0) {
			title = optionElement.dataset.title;
		}
		else {
			title = optionElement.innerHTML;
		}

		itemElement.classList.add("c-select__item");
		itemElement.setAttribute("tabindex", "0");
		itemElement.dataset.value = optionElement.value;

		if (this.isMultiple) {
			var checkboxId = Util.uniqueId("__sushiSelectCheckbox");
			var checkboxHtml = "<input type='checkbox' id='" + checkboxId + "' tabindex='-99'>";
			var checkboxElement = Dom.parse(checkboxHtml);

			Dom.addClass(checkboxElement, [
				"c-select__checkbox",
				"o-choiceInput__input",
				"o-choiceInput__input--checkbox",
			]);

			titleElement = Dom.parse("<label for='" + checkboxId + "'>");

			titleElement.classList.add("o-choiceInput__label");

			itemElement.classList.add("o-choiceInput");
			itemElement.appendChild(checkboxElement);
		}
		else {
			titleElement = document.createElement("div");
		}

		titleElement.classList.add("c-select__itemTitle");
		titleElement.innerHTML = title;

		itemElement.appendChild(titleElement);

		Dom.addClass(itemElement, optionElement.getAttribute("class"));

		return itemElement;
	};

	proto.updateSelectedOptions = function () {
		var selectedOptions = this.triggerElement.selectedOptions;

		this.availableOptions = this.triggerElement.getElementsByTagName("option");

		for (var i = 0; i < this.dropdownItems.length; i++) {
			var itemElement = this.dropdownItems[i];
			var optionElement = this.availableOptions[i];

			if (Array.prototype.slice.call(selectedOptions).includes(optionElement)) {
				itemElement.classList.add("is-active");
			}
			else {
				itemElement.classList.remove("is-active");
			}
		}

		Events(this.triggerElement).trigger("update");

		this.updateButtonLabel();
		this.filterItems();
	};

	proto.updateButtonLabel = function () {
		var label;

		if (this.isMultiple) {
			var selectedOptionLabels = [];

			for (var i = 0; i < this.triggerElement.selectedOptions.length; i++) {
				selectedOptionLabels.push(
					this.triggerElement.selectedOptions[i].title
					|| this.triggerElement.selectedOptions[i].label
				);
			}

			label = selectedOptionLabels.join(this.options.multipleSeparator);
		}
		else if (this.triggerElement.selectedOptions[0] !== void 0) {
			label = getOptionLabel(this.triggerElement.selectedOptions[0]);
		}

		if (!label) {
			label = getOptionLabel(this.availableOptions[0]);
		}

		this.buttonElement.innerHTML = label;
	};

	proto.filterItems = function () {
		this.dropdownItems.forEach(function (item) {
			item.classList.add("_hidden");
		});

		this.dropdownItems.filter(this.itemMatchesFilters, this).forEach(function (item) {
			item.classList.remove("_hidden");
		});

		this.groups.forEach(function (group) {
			var groupLabel = group.getElementsByClassName("c-select__groupLabel").item(0);
			var totalVisibleItems = Array.prototype.slice.call(
				group.getElementsByClassName("c-select__item")
			).filter(Select.itemIsVisible).length;

			if (totalVisibleItems === 0) {
				groupLabel.classList.add("_hidden");
			}
			else {
				groupLabel.classList.remove("_hidden");
			}
		});
	};

	proto.itemMatchesFilters = function (itemElement) {
		var matches = true;

		for (var filterType in this.filters) {
			if (!this.filters.hasOwnProperty(filterType)) {
				continue;
			}

			matches = (
				matches
				&& Select.filterItem(itemElement, filterType, this.filters[filterType])
			);

			if (!matches) {
				break;
			}
		}

		return matches;
	};

	Select.filterItem = function (itemElement, filterType, filterValue) {
		var matchesFilter = false;

		switch (filterType) {
			case "search":
				matchesFilter = itemElement.textContent.toLowerCase()
					.includes(filterValue.toLowerCase());

				break;

			case "null":
				matchesFilter = ((itemElement.dataset.value === "") === filterValue);

				break;

			case "selected":
				matchesFilter = (itemElement.classList.contains("is-active") === filterValue);
		}

		return matchesFilter;
	};

	Select.itemIsVisible = function (itemElement) {
		return !itemElement.classList.contains("_hidden");
	};

	Plugins.Select = Select;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
