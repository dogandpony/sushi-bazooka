/* =====================================================================
 * EVENT HELPER CLASS
 * ===================================================================== */

var Sushi;

(function (Sushi, Events) {
	"use strict";

	var EventHelper = function (target) {
		this.target = target;
	};

	var proto = EventHelper.prototype;

	proto.on = function (types, fn) {
		Events.on(types, this.target, fn);

		return this;
	};

	proto.one = function (types, fn) {
		Events.one(types, this.target, fn);

		return this;
	};

	proto.off = function (types, fn) {
		Events.off(types, this.target, fn);

		return this;
	};

	proto.trigger = function (types, data) {
		Events.trigger(types, this.target, data);

		return this;
	};

	Sushi.Events.EventHelper = EventHelper;
})(Sushi || (Sushi = {}), Sushi.Events || (Sushi.Events = {}));
