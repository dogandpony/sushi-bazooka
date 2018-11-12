/* ==============================================================================================
 * HISTORY STATE
 * ============================================================================================== */

var Sushi;

(function (Sushi) {
	"use strict";

	var HistoryState = function (useBasePath, basePathname) {
		this.useBasePath = false;
		this.basePathname = null;
		this.nativePushStateSupport = null;
		this.currentState = null;
		this.historyAndCurrentStack = null;
		this.forwardStack = null;
		this.updateStacks = true;
		this.stateDiscriminatorIterator = 0;
		this.isReplaceState = false;

		this.init(useBasePath, basePathname);
	};

	HistoryState.prototype.constructor = HistoryState;

	HistoryState.prototype.init = function (useBasePath, basePathname) {

		var nativePushStateSupport = false;
		// Set if it has a native support for pushState

		if ((window.history) && (window.history.pushState)) {
			nativePushStateSupport = true;
		}

		this.setNativePushStateSupport(nativePushStateSupport);

		/*
			 * By default, the base path is not used, let's check the
			 * parameter value
			 */
		if (typeof useBasePath !== "undefined") {
			if (useBasePath) {
				// Ok, it should use the base path
				this.setUseBasePath(true);
			}
		}

		if (typeof basePathname === "string") {
			// It has a valid base path name
			this.setBasePathname(basePathname);
		}
		else if (
			(typeof basePathname === "undefined")
			|| (basePathname === null)
			|| (basePathname === "")
		) {
			// Use the window.location.pathname as the base path name
			this.setBasePathname(window.location.pathname);
		}
		else {
			throw "basePathname must be null, not passed or a string, "
				+ (typeof basePathname) + " given";
		}

		this.registerEventListeners();

	};


	// Getters and setters
	/**
	 * @param {Boolean} useBasePath
	 * @retruns {HistoryState}
	 */
	HistoryState.prototype.setUseBasePath = function (useBasePath) {
		this.useBasePath = useBasePath;

		return this;
	};


	/**
	 *
	 * @returns {Boolean}
	 */
	HistoryState.prototype.getUseBasePath = function () {
		return this.useBasePath;
	};


	/**
	 *
	 * @param {String} basePathname
	 * @returns {HistoryState}
	 */
	HistoryState.prototype.setBasePathname = function (basePathname) {
		if (basePathname.charAt(0) !== "/") {
			basePathname = "/" + basePathname;
		}

		this.basePathname = basePathname;

		return this;
	};


	/**
	 *
	 * @returns {String}
	 */
	HistoryState.prototype.getBasePathname = function () {
		return this.basePathname;
	};


	/**
	 * @param {Boolean} nativePushStateSupport
	 * @returns {HistoryState}
	 */
	HistoryState.prototype.setNativePushStateSupport = function (nativePushStateSupport) {
		this.nativePushStateSupport = nativePushStateSupport;

		return this;
	};


	/**
	 * @returns {Boolean}
	 */
	HistoryState.prototype.getNativePushStateSupport = function () {
		return this.nativePushStateSupport;
	};


	/**
	 *
	 * @param state
	 * @returns {HistoryState}
	 */
	HistoryState.prototype.setCurrentState = function (state) {
		this.currentState = state;

		return this;
	};


	/**
	 * Be careful, this function only works with native support.
	 * For non-native use the getState function instead.
	 * @returns
	 */
	HistoryState.prototype.getCurrentState = function () {
		if (!this.getNativePushStateSupport()) {
			throw "This function should not be used for non-native support."
			+ " Please use getState in all occasions.";
		}

		return this.currentState;
	};


	/**
	 *
	 * @param {StateStack} sushiStateStack
	 * @returns {HistoryState}
	 */
	HistoryState.prototype.setHistoryAndCurrentStack = function (sushiStateStack) {
		this.historyAndCurrentStack = sushiStateStack;

		return this;
	};


	/**
	 *
	 * @returns {StateStack}
	 */
	HistoryState.prototype.getHistoryAndCurrentStack = function () {
		if (this.historyAndCurrentStack === null) {
			this.setHistoryAndCurrentStack(new Sushi.StateStack());
		}

		return this.historyAndCurrentStack;
	};


	/**
	 *
	 * @param {StateStack} sushiStatesStack
	 * @returns {HistoryState}
	 */
	HistoryState.prototype.setForwardStack = function (sushiStatesStack) {
		this.forwardStack = sushiStatesStack;

		return this;
	};


	/**
	 *
	 * @returns {StateStack}
	 */
	HistoryState.prototype.getForwardStack = function () {
		if (this.forwardStack === null) {
			this.setForwardStack(new Sushi.StateStack());
		}

		return this.forwardStack;
	};


	/**
	 *
	 * @param {Boolean} updateStacks
	 * @returns {HistoryState}
	 */
	HistoryState.prototype.setUpdateStacks = function (updateStacks) {
		this.updateStacks = updateStacks;

		return this;
	};


	/**
	 *
	 * @returns {Boolean}
	 */
	HistoryState.prototype.getUpdateStacks = function () {
		return this.updateStacks;
	};


	/**
	 * It iterates throught the diferent state
	 * @returns {Number}
	 */
	HistoryState.prototype.getStateDiscriminatorIterator = function () {
		return this.stateDiscriminatorIterator++;
	};


	/**
	 *
	 * @param isReplaceState
	 * @returns {HistoryState}
	 */
	HistoryState.prototype.setIsReplaceState = function (isReplaceState) {
		this.isReplaceState = isReplaceState;

		return this;
	};


	/**
	 *
	 * @returns {Boolean}
	 */
	HistoryState.prototype.getIsReplaceState = function () {
		return this.isReplaceState;
	};


	HistoryState.prototype.registerEventListeners = function () {
		var currentInstance = this;

		var onSushiHistoryStatePopEvent = {
			stateData: null,
		};

		if (this.getNativePushStateSupport()) {
			Sushi.Events(window).on("popstate", function (event) {

				currentInstance.setIsReplaceState(false);

				onSushiHistoryStatePopEvent.stateData = event.state;

				currentInstance.setCurrentState(event.state);

				// Here we trigger the Sushi event
				Sushi.Events(window).trigger(
					"onSushiHistoryStatePopEvent",
					onSushiHistoryStatePopEvent
				);
			});
		}
		else {
			Sushi.Events(window).on("hashchange", function (event) {

				if (!currentInstance.getUpdateStacks()) {
					// Do nothing, only update the status
					currentInstance.setUpdateStacks(true);
				}
				else {
					/*
				    * It was caused by an user action
				    * We need to get the state in one of the stacks
				    * (History or Forward)
				    * If we can't find the state, we would use a replaceState because the user
				    * changed the URL manually by themselves
				    */
					var stateDataToDispatch = null;

					var currentPath = window.location.hash.replace("#!", "");

					var matchState = null;

					var oldState = currentInstance.getHistoryAndCurrentStack().pop();

					if (oldState === null) {
						// No state in the history stack, it could be in the forward stack
						oldState = currentInstance.getForwardStack().pop();

						if (oldState === null) {
							/*
						    * Ok, a new hash came from nothing.
						    * We need to push it into the history
						    * The state value will be null
						    */
							currentInstance.getHistoryAndCurrentStack().push({
								state: stateDataToDispatch,
								title: null,
								originalPath: currentPath,
								path: currentPath,
							});
						}
						else {
							// Let's check if the hash match
							if (oldState.path === currentPath) {
								// We have a match, forward operation
								matchState = oldState;

								currentInstance.getHistoryAndCurrentStack().push(matchState);
							}
							else {
								// New
								/*
								 * Ok, a new hash came from nothing.
								 * We need to push it into the history
								 * The state value will be null
								 */
								currentInstance.getHistoryAndCurrentStack().push({
									state: stateDataToDispatch,
									title: null,
									originalPath: currentPath,
									path: currentPath,
								});

								// Clean the forward
								currentInstance.getForwardStack().clean();
							}
						}
					}
					else {
						if (oldState.path === currentPath) {
							matchState = oldState;
						}
						else {
							// So, let's see if we have a second old state
							var secondOldState = currentInstance.getHistoryAndCurrentStack().pop();

							if (secondOldState === null) {
								// We only have a new state, but we need to verify
								// if it matches with a forward state
								secondOldState = currentInstance.getForwardStack().pop();

								if (secondOldState === null) {
									// New
									/*
									* Ok, a new hash came from nothing.
									* We need to push it into the history
									* The state value will be null
									* We also need to push the oldState
									*/
									currentInstance.getHistoryAndCurrentStack().push(oldState);
									currentInstance.getHistoryAndCurrentStack().push({
										state: stateDataToDispatch,
										title: null,
										originalPath: currentPath,
										path: currentPath,
									});
								}
								else {
									if (secondOldState.path === currentPath) {
										// Forward
										matchState = secondOldState;

										currentInstance.getHistoryAndCurrentStack().push(oldState);
										currentInstance.getHistoryAndCurrentStack()
											.push(matchState);
									}
									else {
										// New
										/*
										 * Ok, a new hash came from nothing.
										 * We need to push it into the history
										 * The state value will be null
										 */
										currentInstance.getHistoryAndCurrentStack().push({
											state: stateDataToDispatch,
											title: null,
											originalPath: currentPath,
											path: currentPath,
										});

										// Clean the forward
										currentInstance.getForwardStack().clean();
									}
								}
							}
							else {
								// Let's see if it matches or not
								if (secondOldState.path === currentPath) {
									// Back
									matchState = secondOldState;

									currentInstance.getHistoryAndCurrentStack().push(matchState);

									currentInstance.getForwardStack().push(oldState);
								}
								else {
									// Re-populate the history
									currentInstance.getHistoryAndCurrentStack()
										.push(secondOldState);
									currentInstance.getHistoryAndCurrentStack().push(oldState);

									oldState = currentInstance.getForwardStack().pop();

									if (oldState === null) {
										// New
										/*
										 * Ok, a new hash came from nothing.
										 * We need to push it into the history
										 * The state value will be null
										 * We also need to push the oldState
										 */
										currentInstance.getHistoryAndCurrentStack().push({
											state: stateDataToDispatch,
											title: null,
											originalPath: currentPath,
											path: currentPath,
										});

										// Clean the forward
										currentInstance.getForwardStack().clean();
									}
									else {
										if (oldState.path === currentPath) {
											// Forward
											matchState = oldState;

											currentInstance.getHistoryAndCurrentStack()
												.push(oldState);
										}
										else {
											// New
											/*
										    * Ok, a new hash came from nothing.
										    * We need to push it into the history
										    * The state value will be null
										    * We also need to push the oldState
										    */
											currentInstance.getHistoryAndCurrentStack().push({
												state: stateDataToDispatch,
												title: null,
												originalPath: currentPath,
												path: currentPath,
											});

											// Clean the forward
											currentInstance.getForwardStack().clean();
										}
									}
								}
							}
						}
					}

					stateDataToDispatch = (matchState !== null ? matchState.state : null);

					// Now triggers the event
					onSushiHistoryStatePopEvent.stateData = stateDataToDispatch;

					// Here we trigger the Sushi event
					Sushi.Events(window).trigger(
						"onSushiHistoryStatePopEvent",
						onSushiHistoryStatePopEvent
					);
				}

			});
		}
	};

	/**
	 * Push a new state
	 *
	 * @param {Object} state
	 * @param {String} title
	 * @param {String} path
	 */
	HistoryState.prototype.push = function (state, title, path) {
		if (typeof path === "undefined") {
			throw "HistoryState.push: path is mandatory";
		}

		if (this.getNativePushStateSupport()) {
			var relativeUrl = path;

			this.setIsReplaceState(false);

			if (this.getUseBasePath()) {
				relativeUrl = this.getBasePathname()
					+ (relativeUrl.charAt(0) === "/" ? "" : "/")
					+ relativeUrl;
			}

			// Use the native function
			window.history.pushState(state, title, relativeUrl);

			this.setCurrentState(state);
		}
		else {
			// Hash doesn't need to check the basePath usage

			// Get the current state
			var currentStateData = this.getHistoryAndCurrentStack().pop();

			var uniquePathValue = path;

			if (currentStateData !== null) {
				if (currentStateData.path === uniquePathValue) {
					/*
							   * We need to discriminate the path here
							   */
					if (uniquePathValue.indexOf("?") > -1) {
						uniquePathValue += "&";
					}
					else {
						uniquePathValue += "?";
					}

					uniquePathValue += "_dp=".concat(this.getStateDiscriminatorIterator());
				}

				this.getHistoryAndCurrentStack().push(currentStateData);
			}

			// Push the state
			this.getHistoryAndCurrentStack().push({
				state: state,
				title: title,
				originalPath: path,
				path: uniquePathValue,
			});

			// Clean the forward stak
			this.getForwardStack().clean();

			// Do nothing with the stacks, and don't trigger the event
			this.setUpdateStacks(false);

			// Change the hash
			window.location.hash = "#!" + uniquePathValue;
		}
	};

	/**
	 * Replace the current state
	 *
	 * @param {Object} state
	 * @param {String} title
	 * @param {String} path
	 */
	HistoryState.prototype.replace = function (state, title, path) {
		if (typeof path === "undefined") {
			throw "HistoryState.replace: path is mandatory";
		}

		if (this.getNativePushStateSupport()) {
			var relativeUrl = path;

			if (this.getUseBasePath()) {
				relativeUrl = this.getBasePathname()
					+ (relativeUrl.charAt(0) === "/" ? "" : "/")
					+ relativeUrl;
			}

			this.setIsReplaceState(true);

			// Use the native function
			window.history.replaceState(state, title, relativeUrl);

			this.setCurrentState(state);
		}
		else {
			// Hash doesn't need to check the basePath usage

			// Pop the current state (it will be replaced by the new one)
			this.getHistoryAndCurrentStack().pop();

			/*
				   * We need to check if there is a previous or a next state with the same path.
				   * If so, we should use the discriminator
				   */

			var previousStateData = this.getHistoryAndCurrentStack().pop();

			var nextStateData = this.getForwardStack().pop();

			var uniquePathValue = path;

			var appendUniqueDiscriminator = false;

			if (previousStateData !== null) {
				if (previousStateData.path === uniquePathValue) {
					appendUniqueDiscriminator = true;
				}

				this.getHistoryAndCurrentStack().push(previousStateData);
			}

			if (nextStateData !== null) {
				if (nextStateData.path === uniquePathValue) {
					appendUniqueDiscriminator = true;
				}

				this.getForwardStack().push(nextStateData);
			}

			if (appendUniqueDiscriminator) {
				/*
						 * We need to discriminate the path here
						 */
				if (uniquePathValue.indexOf("?") > -1) {
					uniquePathValue += "&";
				}
				else {
					uniquePathValue += "?";
				}

				uniquePathValue += "_dp=".concat(this.getStateDiscriminatorIterator());
			}

			// Push the state
			this.getHistoryAndCurrentStack().push({
				state: state,
				title: title,
				originalPath: path,
				path: uniquePathValue,
			});

			// We don't need to change the forward states as we are replacing an event

			// Do nothing with the stacks, and don't trigger the event
			this.setUpdateStacks(false);

			// Change the hash
			window.location.hash = "#!" + path;
		}
	};

	/**
	 * Returns the object of the current state (it works for native support and
	 * not native support).
	 * @returns {Object}
	 */
	HistoryState.prototype.getState = function () {
		if (this.getNativePushStateSupport()) {
			return this.getCurrentState();
		}
		else {
			var currentState = this.getHistoryAndCurrentStack().pop();

			if (currentState !== null) {
				this.getHistoryAndCurrentStack().push(currentState);

				return currentState.state;
			}

			return null;
		}
	};

	Sushi.HistoryState = HistoryState;
})(Sushi || (Sushi = {}));
