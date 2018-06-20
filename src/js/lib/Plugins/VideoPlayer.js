/* =========================================================================
 * Video Player
 * ========================================================================= */

var Sushi;

(function (Sushi) {

	"use strict";

	var DEFAULT_OPTIONS = {
		url: "https://youtu.be/XIMLoLxmTDw",
		hideOnPause: false,
		container: "body",
		width: "100%",
		height: "100%",
	};

	var DEFAULT_API_OPTIONS = {
		rel: false,
		modestbranding: true,
		autohide: true,
		showinfo: false,
		autoplay: false,
		iv_load_policy: 3, // do not show annotations
		enablejsapi: 1
	};



	// Youtube iframe API
	// ---------------------------

	var tag = document.createElement("script");
	tag.src = "https://www.youtube.com/iframe_api";
	document.body.appendChild(tag);

	function onYouTubeIframeAPIReady () {
		$(document).trigger("youtubeApiReady");
	}

	// Export the listener to the window object so the API can find it
	window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;



	// Class definition
	// ---------------------------

	var VideoPlayer = function (playButton, options, apiOptions) {

		var it = this;

		this.id = Sushi.Util.uniqueId("videoPlayer");

		this.playButton = (playButton || $());

		this.apiOptions = $.extend(
			{},
			DEFAULT_API_OPTIONS,
			apiOptions,
			Sushi.Util.getNamespaceProperties("apiOptions", this.playButton.data())
		);

		this.options = $.extend(
			{},
			DEFAULT_OPTIONS,
			options,
			Sushi.Util.getNamespaceProperties("videoPlayer", this.playButton.data())
		);

		this.options.container = $(this.options.container);

		$(document).on("youtubeApiReady", function () {

			if (it.options.container.length === 0) {
				console.warn("Video Player: video container wasn\'t found. (%s)", it.id);
			}
			else {
				it.createPlayer();
				it.registerListeners();
			}

		});

	};



	// Methods
	// ---------------------------

	VideoPlayer.prototype.constructor = VideoPlayer;

	VideoPlayer.prototype.createPlayer = function () {

		$("<div id='" + this.id + "' class='c-videoPlayer'/>").appendTo(this.options.container);

		this.player = new YT.Player(this.id, {
			width: this.options.width,
			height: this.options.height,
			videoId: Sushi.Util.getYouTubeVideoID(this.options.url),
			playerVars: this.apiOptions,
			events: {
				onStateChange: $.proxy(this.playerStateChange, this)
			}
		});

	};

	VideoPlayer.prototype.registerListeners = function () {

		var it = this;

		this.playButton.on("click.VideoPlayer", function (event) {

			event.preventDefault();

			it.play();

		});

	};

	VideoPlayer.prototype.play = function () {

		this.player.playVideo();

	};

	VideoPlayer.prototype.stop = function () {

		this.player.stopVideo();

	};

	VideoPlayer.prototype.playerStateChange = function (event) {

		switch (event.data) {
			case YT.PlayerState.PLAYING :
				this.playButton.addClass("is-playing");
				this.options.container.addClass("is-playing");
				break;

			case YT.PlayerState.ENDED :
			case YT.PlayerState.STOPPED :
				this.playButton.removeClass("is-playing");
				this.options.container.removeClass("is-playing");
				break;

			default :
		}

	};


	Sushi.VideoPlayer = VideoPlayer;

})(Sushi || (Sushi = {}));
