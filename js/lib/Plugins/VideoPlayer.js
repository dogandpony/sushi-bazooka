/* ==============================================================================================
 * VIDEO PLAYER
 *
 * How To Use
 * Create the following markup:
 * <div data-plugin="VideoPlayer"
 *   data-video-player-url="<!-- youtube video URL -->"
 * 	 class="c-videoPlayer o-ratio o-ratio--16:9">
 * 	 <div class="c-videoPlayer__placeholder">
 *     <img src="placeholderImage.jpg">
 * 	 </div>
 * </div>
 * ============================================================================================== */

var Sushi;

(function (Sushi, Plugins) {
	"use strict";

	var BasePlugin = Plugins.BasePlugin;
	var Events = Sushi.Events;

	var createYoutubeScriptTag = function () {
		var tag = document.createElement("script");

		tag.src = "https://www.youtube.com/iframe_api";
		document.body.appendChild(tag);
	};

	var registerApiReadyFunction = function () {
		var externalFunction = window.onYouTubeIframeAPIReady;

		var onYouTubeIframeAPIReady = function () {
			if (typeof externalFunction === "function") {
				externalFunction();
			}

			Events(document).trigger("youtubeApiReady");
		};

		window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
	};

	var VideoPlayer = function (triggerElement, options) {
		BasePlugin.call(this, triggerElement, options);

		var apiOptions = JSON.parse(this.options.apiOptions);

		this.apiOptions = Object.assign(
			{},
			this.constructor.DEFAULT_API_OPTIONS,
			apiOptions,
			{
				autoplay: this.options.autoPlay,
			}
		);

		this.videoId = VideoPlayer.getYoutubeVideoId(this.options.url);

		Events(document).on("youtubeApiReady", function () {
			this.create();
			this.registerListeners();
		}.bind(this));
	};

	VideoPlayer.displayName = "VideoPlayer";

	VideoPlayer.DEFAULTS = {
		url: "https://youtu.be/XIMLoLxmTDw",
		hideOnPause: false,
		// appendTo: null,
		element: null,
		width: "100%",
		height: "100%",
		autoPlay: false,
		apiOptions: "{}",
	};

	VideoPlayer.DEFAULT_API_OPTIONS = {
		rel: false,
		modestbranding: true,
		autohide: true,
		showinfo: false,
		// eslint-disable-next-line camelcase
		iv_load_policy: 3, // do not show annotations
		enablejsapi: 1,
	};

	VideoPlayer.prototype = Object.create(BasePlugin.prototype);

	var proto = VideoPlayer.prototype;

	proto.constructor = VideoPlayer;

	proto.create = function () {
		this.playerElement = this.triggerElement.querySelector(".c-videoPlayer__player");
		this.placeholderElement = this.triggerElement.querySelector(".c-videoPlayer__placeholder");
		this.placeholderImageElement = this.triggerElement.querySelector(
			".c-videoPlayer__placeholderImage"
		);

		// Create player element if it doesn't exist
		if (this.playerElement === null) {
			this.playerElement = document.createElement("div");
			this.playerElement.classList.add("c-videoPlayer__player");

			this.triggerElement.appendChild(this.playerElement);
		}

		// Create placeholder element if it doesn't exist
		if (this.placeholderElement === null) {
			this.placeholderElement = document.createElement("div");
			this.placeholderElement.classList.add("c-videoPlayer__placeholder");

			this.triggerElement.appendChild(this.placeholderElement);
		}

		// Create placeholder image element if it doesn't exist
		if (this.placeholderImageElement === null) {
			this.placeholderImageElement = document.createElement("img");
			this.placeholderImageElement.classList.add("c-videoPlayer__placeholderImage");
			this.placeholderImageElement.src = "https://i3.ytimg.com/vi/" + this.videoId
				+ "/maxresdefault.jpg";

			this.placeholderElement.appendChild(this.placeholderImageElement);
		}

		this.playerElement.id = "videoPlayer" + this.id;

		this.triggerElement.classList.add("c-videoPlayer");

		this.player = new window.YT.Player(this.playerElement.id, {
			width: this.options.width,
			height: this.options.height,
			videoId: this.videoId,
			playerVars: this.apiOptions,
			events: {
				onReady: this.playerReady.bind(this),
				onStateChange: this.playerStateChange.bind(this),
			},
		});
	};

	VideoPlayer.prototype.registerListeners = function () {
		Events(this.placeholderElement).on("VideoPlayer.click", function (event) {
			event.preventDefault();

			if (this.triggerElement.classList.contains("is-ready")) {
				this.play();
			}
		}.bind(this));
	};

	VideoPlayer.prototype.play = function () {
		this.player.playVideo();
	};

	VideoPlayer.prototype.stop = function () {
		this.player.stopVideo();
	};

	VideoPlayer.prototype.playerReady = function (event) {
		this.triggerElement.classList.add("is-ready");
	};

	VideoPlayer.prototype.playerStateChange = function (event) {
		switch (event.data) {
			case window.YT.PlayerState.PLAYING:
			case window.YT.PlayerState.BUFFERING:
				this.triggerElement.classList.add("is-playing");

				break;

			default:
				this.triggerElement.classList.remove("is-playing");
		}
	};


	/**
	 * Matches and returns the video ID of any valid YouTube URL.
	 *
	 * @author Stephan Schmitz <eyecatchup@gmail.com>
	 * @url http://stackoverflow.com/a/10315969/624466
	 */
	VideoPlayer.getYoutubeVideoId = function (url) {
		var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

		return (url.match(p)) ? RegExp.$1 : false;
	};

	Plugins.VideoPlayer = VideoPlayer;

	createYoutubeScriptTag();
	registerApiReadyFunction();
})(Sushi || (Sushi = {}), Sushi.Plugins || (Sushi.Plugins = {}));
