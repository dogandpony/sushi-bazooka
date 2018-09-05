/* ==============================================================================================
 * PROGRESSIVE IMAGES
 *
 * Basically a ripoff of https://github.com/zafree/pilpil
 * ============================================================================================== */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var BasePlugin = Plugins.BasePlugin;
	var Dom = Sushi.Dom;

	var ProgressiveImage = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		this.thumbnail = this.triggerElement;
		this.containerAttributes = JSON.parse(this.options.containerAttributes || "{}");
		this.imageAttributes = JSON.parse(this.options.imageAttributes || "{}");

		if ([this.options.src, this.options.width, this.options.height].includes(void 0)) {
			// eslint-disable-next-line no-console
			return console.warn(
				"Progressive Image is missing base attributes. Please include at least `src`,"
				+ " `width` and `height` in the attribute list."
			);
		}

		this.createContainers();
		this.loadImage();
	};

	ProgressiveImage.DEFAULTS = {
		blurRadius: 2,
		containerAttributes: "",
		imageAttributes: "",
	};

	ProgressiveImage.displayName = "ProgressiveImage";

	ProgressiveImage.prototype = Object.create(BasePlugin.prototype);

	var proto = ProgressiveImage.prototype;

	proto.constructor = ProgressiveImage;

	proto.createContainers = function () {
		this.container = document.createElement("div");
		this.fill = Dom.parse("<div class='o-progressiveImage__fill'>");
		this.imageFrame = Dom.parse("<div class='o-progressiveImage__imageFrame'>");
		this.canvas = Dom.parse("<canvas class='o-progressiveImage__canvas'>");
		this.originalImage = document.createElement("img");

		for (var containerAttribute in this.containerAttributes) {
			if (this.containerAttributes.hasOwnProperty(containerAttribute)) {
				this.container.setAttribute(
					containerAttribute,
					this.containerAttributes[containerAttribute]
				);
			}
		}

		for (var imageAttribute in this.imageAttributes) {
			if (this.imageAttributes.hasOwnProperty(imageAttribute)) {
				this.originalImage.setAttribute(
					imageAttribute,
					this.imageAttributes[imageAttribute]
				);
			}
		}

		this.thumbnail.removeAttribute("width");
		this.thumbnail.removeAttribute("height");
		this.thumbnail.removeAttribute("data-progressive-image-container-attributes");
		this.thumbnail.removeAttribute("data-progressive-image-image-attributes");

		this.container.classList.add("o-progressiveImage");
		this.originalImage.classList.add("o-progressiveImage__originalImage");
		this.thumbnail.classList.add("o-progressiveImage__thumbnail");

		this.thumbnail.insertAdjacentElement("afterend", this.container);

		this.imageFrame.appendChild(this.thumbnail);
		this.imageFrame.appendChild(this.canvas);
		this.imageFrame.appendChild(this.originalImage);

		this.container.appendChild(this.fill);
		this.container.appendChild(this.imageFrame);
	};

	proto.loadImage = function () {
		var fillRatio = (this.options.height / this.options.width) * 100;

		this.fill.style.paddingBottom = fillRatio + "%";

		this.triggerElement.style.width = this.options.width + "px";
		this.triggerElement.style.height = this.options.height + "px";

		var virtualThumbnail = new Image();

		virtualThumbnail.src = this.thumbnail.src;

		virtualThumbnail.onload = function () {
			this.drawThumbnailOnCanvas();

			this.container.classList.add("is-thumbnailLoaded");
		}.bind(this);

		this.originalImage.src = this.options.src;

		this.originalImage.onload = function () {
			this.container.classList.add("is-imageLoaded");
		}.bind(this);
	};

	proto.drawThumbnailOnCanvas = function () {
		var context = this.canvas.getContext("2d");

		this.canvas.width = this.thumbnail.width;
		this.canvas.height = this.thumbnail.height;

		context.drawImage(this.thumbnail, 0, 0);

		context.globalAlpha = 0.5;

		for (var i = -this.options.blurRadius; i <= this.options.blurRadius; i += 1) {
			for (var n = -this.options.blurRadius; n <= this.options.blurRadius; n += 1) {
				context.drawImage(this.canvas, n, i);

				if ((n >= 0) && (i >= 0)) {
					context.drawImage(this.canvas, -(n - 1), -(i - 1));
				}
			}
		}
	};

	Plugins.ProgressiveImage = ProgressiveImage;
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
