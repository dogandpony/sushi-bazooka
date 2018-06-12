var Sushi;

(function () {

	'use strict';

	var StateStack = function () {
		this.stack = [];
	};

	StateStack.prototype.constructor = StateStack;



	// Getters and setters
	// ---------------------------

	StateStack.prototype.setStack = function (stack) {
		this.stack = stack;
		return this;
	};

	StateStack.prototype.getStack = function () {
		return this.stack;
	};


	/**
	 * Push
	 */
	StateStack.prototype.push = function (stateData) {
		this.getStack().push(stateData);
	};


	/**
	 * Pop (null if there are no elements in the stack
	 * @returns {StateData}|null
	 */
	StateStack.prototype.pop = function () {
		var stateData = null;

		if (this.getStack().length > 0) {
			stateData = this.getStack()[this.getStack().length - 1];

			this.setStack(this.getStack().slice(0, this.getStack().length - 1));
		}

		return stateData;
	};


	/**
	 * Clear the stack
	 */
	StateStack.prototype.clean = function () {
		this.setStack([]);
	};

	Sushi.StateStack = StateStack;

})(Sushi || (Sushi = {}));
