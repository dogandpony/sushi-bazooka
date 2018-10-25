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

		this.isMultiple = (this.triggerElement.getAttribute("multiple") !== null);

		this.createContainer();
		this.registerListeners();
	};

	Select.displayName = "Select";

	Select.DEFAULTS = {
		bare: false,
		hideSelected: false,
		hideNull: false,
		extraClasses: "",
		multipleSeparator: ", ",
	};

	Select.prototype = Object.create(BasePlugin.prototype);

	var proto = Select.prototype;

	proto.constructor = Select;

	proto.createContainer = function () {
		this.containerElement = Dom.parse("<div class='c-select'>");

		this.buttonElement = Dom.parse(
			"<button class='c-select__button' type='button'>"
		);

		this.triggerElement.classList.add("c-select__select");
		this.triggerElement.setAttribute("tabindex", "-99");

		if (this.options.bare) {
			this.containerElement.classList.add("c-select--bare");
		}

		// Add the container after the select
		this.triggerElement.parentNode.insertBefore(
			this.containerElement,
			this.triggerElement.nextSibling
		);

		// Move the select to the container
		this.containerElement.appendChild(this.triggerElement);



		/* Dropdown
		   --------------------------- */

		this.dropdownElement = Dom.parse("<ul class='c-select__dropdown c-dropdown'>");

		this.updateItems();

		// Append new elements
		this.containerElement.appendChild(this.buttonElement);
		this.containerElement.appendChild(this.dropdownElement);

		this.dropdown = new Dropdown(this.containerElement, {
			triggerEvent: "click",
			closeOnSelect: !this.isMultiple,
			closeIntentionTimeout: 0,
		});

		if (this.options.extraClasses) {
			Dom.addClass(this.dropdownElement, this.options.extraClasses);
			Dom.addClass(this.buttonElement, this.options.extraClasses);
		}
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
			Dom.query(".c-select__item.is-active", this.dropdownElement)
			|| Dom.query(".c-select__item", this.dropdownElement)
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

	proto.registerItemListeners = function () {
		if (this.isMultiple) {
			Events(Dom.queryAll(".c-select__checkbox", this.dropdownElement))
				.on("select.change", this.handleCheckboxChange.bind(this));
		}
		else {
			Events(Dom.queryAll(".c-select__item", this.dropdownElement))
				.on("select.click", this.handleItemClick.bind(this));
		}
	};

	proto.updateItems = function () {
		var childElements = this.triggerElement.children;
		var dropdownChildrenFragment = document.createDocumentFragment();

		Events(this.dropdownElement.getElementsByClassName("c-select__item")).off("Select.click");

		this.dropdownItems = [];

		for (var i = 0; i < childElements.length; i++) {
			var itemElement;
			var childElement = childElements[i];
			var elementTag = childElement.tagName.toLowerCase();

			if (elementTag === "optgroup") {
				itemElement = this.createGroup(childElement);
			}
			else if (elementTag === "option") {
				itemElement = this.createItem(childElement);
				this.dropdownItems.push(itemElement);
			}

			dropdownChildrenFragment.appendChild(itemElement);
		}

		this.dropdownElement.innerHTML = "";
		this.dropdownElement.appendChild(dropdownChildrenFragment);

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

		listElement.classList.add("c-select__groupList");

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

		return itemElement;
	};

	proto.updateSelectedOptions = function () {
		var selectedOptions = this.triggerElement.selectedOptions;

		this.availableOptions = this.triggerElement.getElementsByTagName("option");

		for (var i = 0; i < this.dropdownItems.length; i++) {
			var itemElement = this.dropdownItems[i];
			var optionElement = this.availableOptions[i];

			if (this.options.hideNull && (itemElement.dataset.value === "")) {
				itemElement.classList.add("_hidden");
			}
			else if (Array.prototype.slice.call(selectedOptions).includes(optionElement)) {
				itemElement.classList.add("is-active");

				if (this.options.hideSelected) {
					itemElement.classList.add("_hidden");
				}
			}
			else {
				itemElement.classList.remove("is-active");
			}
		}

		Events(this.triggerElement).trigger("update");

		this.updateButtonLabel();
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

	Plugins.Select = Select;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
