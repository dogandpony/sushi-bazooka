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
		this.loadThumbnail();

		if (this.options.lazyLoad) {
			if (Plugins.ScrollTrigger !== void 0) {
				this.registerLazyLoad();
			}
			else {
				// eslint-disable-next-line no-console
				console.warn(
					"ProgressiveImage is set to lazy load images but ScrollTrigger plugin doesn't"
					+ " exist."
				);
			}
		}
		else {
			this.loadOriginalImage();
		}
	};

	ProgressiveImage.DEFAULTS = {
		blurRadius: 2,
		containerAttributes: "",
		imageAttributes: "",
		lazyLoad: true,
		setWidth: true,
		responsive: true,
	};

	ProgressiveImage.displayName = "ProgressiveImage";

	ProgressiveImage.prototype = Object.create(BasePlugin.prototype);

	var proto = ProgressiveImage.prototype;

	proto.constructor = ProgressiveImage;

	proto.createContainers = function () {
		this.container = document.createElement("div");
		this.fill = Dom.parse("<div class='c-progressiveImage__fill'>");
		this.imageFrame = Dom.parse("<div class='c-progressiveImage__imageFrame'>");
		this.canvas = Dom.parse("<canvas class='c-progressiveImage__canvas'>");
		this.originalImage = document.createElement("img");

		for (var containerAttribute in this.containerAttributes) {
			if (this.containerAttributes.hasOwnProperty(containerAttribute)) {
				this.container.setAttribute(
					containerAttribute,
					this.containerAttributes[containerAttribute]
				);
			}
		}

		this.thumbnail.removeAttribute("width");
		this.thumbnail.removeAttribute("height");

		this.container.classList.add("c-progressiveImage");
		this.container.classList.add("is-loadingThumbnail");

		if (this.options.setWidth) {
			this.container.style.width = this.options.width + "px";

			if (this.options.responsive) {
				this.container.classList.add("c-progressiveImage--responsive");
			}
		}

		this.originalImage.classList.add("c-progressiveImage__originalImage");
		this.thumbnail.classList.add("c-progressiveImage__thumbnail");

		this.thumbnail.insertAdjacentElement("afterend", this.container);

		this.imageFrame.appendChild(this.originalImage);
		this.imageFrame.appendChild(this.thumbnail);
		this.imageFrame.appendChild(this.canvas);

		this.container.appendChild(this.fill);
		this.container.appendChild(this.imageFrame);
	};

	proto.registerLazyLoad = function () {
		new Plugins.ScrollTrigger(this.container, {
			triggerPosition: "bottom",
			eventAfter: function (scrollTrigger) {
				scrollTrigger.disable();
				this.loadOriginalImage();
			}.bind(this),
		});
	};

	proto.loadThumbnail = function () {
		var fillRatio = (this.options.height / this.options.width) * 100;

		this.fill.style.paddingBottom = fillRatio + "%";

		this.triggerElement.style.width = this.options.width + "px";
		this.triggerElement.style.height = this.options.height + "px";

		var virtualThumbnail = new Image();

		virtualThumbnail.onload = function () {
			this.drawThumbnailOnCanvas();

			this.container.classList.add("is-thumbnailLoaded");
		}.bind(this);

		virtualThumbnail.src = this.thumbnail.src;
	};

	proto.loadOriginalImage = function () {
		this.originalImage.onload = function () {
			this.container.classList.add("is-imageLoaded");
		}.bind(this);

		for (var imageAttribute in this.imageAttributes) {
			if (this.imageAttributes.hasOwnProperty(imageAttribute)) {
				this.originalImage.setAttribute(
					imageAttribute,
					this.imageAttributes[imageAttribute]
				);
			}
		}

		this.originalImage.src = this.options.src;
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
