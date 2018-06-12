/* =========================================================================
 * Styled Select
 *
 * @TODO: close select when it"s focused and the user presses spacebar,
 * then open the dropdown instead
 * ========================================================================= */

var Sushi;

(function (Sushi) {

	"use strict";


	// Class definition
	// ---------------------------

	var StyledSelect = function (select, options) {

		this.select = select;

		this.options = $.extend(
			{},
			StyledSelect.DEFAULTS.options,
			options,
			Sushi.Util.getNamespaceProperties("styledSelect", this.select.data())
		);

		this.createContainer();
		this.registerListeners();
		this.updateCurrentOption();
		this.updateContainerLabel();

	};

	StyledSelect.prototype.constructor = StyledSelect;



	// Default Options
	// ---------------------------

	StyledSelect.DEFAULTS = {};

	StyledSelect.DEFAULTS.options = {
		bare: false,
		hideCurrent: false,
		hideNull: true,
	};



	// Methods
	// ---------------------------

	StyledSelect.prototype.createContainer = function () {

		var self = this;

		this.container = $("<div class='c-styledSelect'>");
		this.containerLabel = $("<div class='c-styledSelect__label'>");

		if (this.options.bare) {
			this.container.addClass("c-styledSelect--bare");
		}

		this.container.insertAfter(this.select);

		this.select.appendTo(this.container);

		this.select.addClass("c-styledSelect__select");



		// Dropdown
		// ---------------------------

		this.dropdown = $("<ul class='c-styledSelect__dropdown o-dropdown'>");

		this.dropdownOptions = $();

		this.select.find("> option").each(function () {

			var title;

			if (this.dataset.styledSelectTitle !== void 0) {
				title = this.dataset.styledSelectTitle;
			}
			else {
				title = this.innerText;
			}

			var subtitle = this.dataset.styledSelectSubtitle;

			var item = $("<li class='c-styledSelect__item'>");

			item.append("<span class='c-styledSelect__title'>" + title + "</span>");

			if (subtitle) {
				item.append(" <span class='c-styledSelect__subtitle'>" + subtitle + "</span>");
			}

			item.attr("data-value", $(this).val());

			self.dropdownOptions = self.dropdownOptions.add(item);

		});

		this.dropdownOptions.appendTo(this.dropdown);

		// Append new elements
		this.containerLabel.add(this.dropdown).insertAfter(this.select);

	};

	StyledSelect.prototype.registerListeners = function () {

		var that = this;

		this.container.on("click.StyledSelect", function (event) {

			var container = this;

			$(this).toggleClass("is-open");

			event.stopPropagation();

			if ($(this).hasClass("is-open")) {
				$(document).off("click.close.StyledSelect")
					.one("click.close.StyledSelect", function () {
						$(container).removeClass("is-open");
					});
			}
			else {
				$(document).off("click.close.StyledSelect");
			}

		});

		this.dropdownOptions.on("click.StyledSelect", function () {

			var itemValue = $(this).data("value");

			if (itemValue !== that.currentOption.value) {
				that.select.val(itemValue).trigger("change");
			}

		});

		this.select.on("change.StyledSelect", function () {

			that.updateCurrentOption();
			that.updateContainerLabel();

		});

	};

	StyledSelect.prototype.updateCurrentOption = function () {

		var that = this;

		var availableOptions = this.select.find("> option");

		var currentOption;

		for (var i = 0; i < availableOptions.length; i++) {
			var option = availableOptions[i];

			if (option.selected === true) {
				currentOption = $(option);
				break;
			}
		}

		this.currentOption = {
			value: currentOption.val(),
			label: currentOption.text(),
		};

		this.dropdownOptions.each(function () {

			if (that.options.hideNull && ($(this).data("value") === "")) {
				$(this).addClass("_hidden");
			}
			else if ($(this).data("value") === that.currentOption.value) {
				$(this).addClass("is-current");

				if (that.options.hideCurrent) {
					$(this).addClass("_hidden");
				}
			}
			else {
				$(this).removeClass("is-current");
			}

		});

		this.select.trigger("update", this.currentOption);

	};

	StyledSelect.prototype.updateContainerLabel = function () {

		this.containerLabel.html(this.currentOption.label ? this.currentOption.label : "&nbsp;");

	};

	Sushi.StyledSelect = StyledSelect;

})(Sushi || (Sushi = {}));
