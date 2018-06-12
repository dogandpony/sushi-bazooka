/* =========================================================================
 * NAVIGATION PRIORITY
 * ========================================================================= */

var Sushi;

(function () {

	'use strict';


	// Private variables
	// ---------------------------

	var DEFAULT_OPTIONS = {
		itemSelector: '> .c-nav__item',
		dropdownParent: '<li>',
		dropdown: '<ul class="o-dropdown">',
		cloneEvents: false,
		hiddenClass: 'is-hidden',
	};



	// Class definition
	// ---------------------------

	var NavigationPriority = function (target, options) {

		this.id = Sushi.Util.uniqueId('navigationPriority');
		this.targetObject = $(target);

		this.options = $.extend(
			{},
			DEFAULT_OPTIONS,
			options,
			Sushi.Util.getNamespaceProperties('navigationPriority', this.targetObject.data())
		);

		this.dropdownObject = $(this.options.dropdown);
		this.dropdownParentObject = $(this.options.dropdownParent);

		this.orderedItems = [];

		this.parseItems();
		this.createDropdownNav();
		this.populateDropdownNav();
		this.enable();
		this.update();

	};



	// Public Methods
	// ---------------------------

	/**
	 * Parses items and their priority from data-attributes
	 */
	NavigationPriority.prototype.parseItems = function () {

		var that = this;

		var orderedByPriority = [];

		// Order items by received priority
		this.targetObject.find(this.options.itemSelector).each(function () {

			orderedByPriority[$(this).data('priority')] = {
				item: $(this),
				dropdownItem: $(this).clone(that.options.cloneEvents)
			};

		});

		var j = 0;

		// Reorder items by index-based priority so the array length does not exceed its
		// real, expected length
		for (var i in orderedByPriority) {
			this.orderedItems[j] = orderedByPriority[i];

			j++;
		}

	};


	NavigationPriority.prototype.createDropdownNav = function () {

		this.dropdownParentObject.append(this.dropdownObject);

		this.targetObject.append(this.dropdownParentObject);

		new Sushi.Dropdown(this.dropdownParentObject, {
			openEvent: 'click',
			closeEvent: 'click',
			preventClickOn: '> a'
		});

	};


	NavigationPriority.prototype.populateDropdownNav = function () {

		var items = $();

		for (var i in this.orderedItems) {
			items = items.add(this.orderedItems[i].dropdownItem);
		}

		this.dropdownObject.html('').append(items);

	};


	NavigationPriority.prototype.update = function () {

		var targetObjectWidth = this.targetObject.width();

		// Remove dropdown parent hidden class so we can measure it
		this.dropdownParentObject.removeClass(this.options.hiddenClass);

		var dropdownParentWidth = Math.max(0, this.dropdownParentObject.outerWidth(true));

		var totalWidth = 0;

		this.targetObject.hide().show(0); // force repaint

		var showDropdown = false;

		for (var i = 0; i < this.orderedItems.length; i++) {
			var item = this.orderedItems[i].item;
			var dropdownItem = this.orderedItems[i].dropdownItem;

			item.add(dropdownItem).removeClass(this.options.hiddenClass);

			totalWidth += Math.ceil(item.outerWidth(true));

			var fitsWithDropdown = (totalWidth < targetObjectWidth - dropdownParentWidth);
			var fitsWithoutDropdown = (totalWidth < targetObjectWidth);

			var isLastItem = (i === (this.orderedItems.length - 1));

			if (fitsWithoutDropdown || (fitsWithDropdown || (isLastItem && fitsWithoutDropdown))) {
				dropdownItem.addClass(this.options.hiddenClass);
			}
			else {
				showDropdown = true;
				item.addClass(this.options.hiddenClass);
			}
		}

		if (!showDropdown) {
			this.dropdownParentObject.addClass(this.options.hiddenClass);
		}

	};


	NavigationPriority.prototype.enable = function () {

		var that = this;

		$(window).on('resize.NavigationPriority.Sushi', Sushi.Util.throttle(function () {

			that.update();

		}));

	};


	NavigationPriority.prototype.disable = function () {

		$(window).off('resize.NavigationPriority.Sushi');

	};


	Sushi.NavigationPriority = NavigationPriority;

})(Sushi || (Sushi = {}));
