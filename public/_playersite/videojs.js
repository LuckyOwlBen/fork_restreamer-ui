var config = {
	controls: true,
	poster: playerConfig.poster + '?t=' + String(new Date().getTime()),
	autoplay: autoplay ? 'muted' : false,
	muted: true,
	liveui: true,
	responsive: true,
	fluid: true,
	// Needed to append the url origin in order for the source to properly pass to the cast device
	sources: [{ src: window.location.origin + '/' + playerConfig.source, type: 'application/x-mpegURL' }],
	plugins: {},
};

if (chromecast) {
	config.techOrder = ['chromecast', 'html5'];
	config.plugins.chromecast = {
		// Provide a default reciever application ID
		receiverApplicationId: 'CC1AD845',
	};
}

var player = videojs('player', config);

player.ready(function () {
	if (chromecast) {
		player.chromecast();
	}

	if (airplay) {
		player.airPlay();
	}

	player.license(playerConfig.license);

	var overlays = [];
	var logosToLoad = 0;
	var logosLoaded = 0;
	var overlayApplied = false;
	
	// Count logos that need to be loaded
	if(playerConfig.logo && playerConfig.logo.image && playerConfig.logo.image.length != 0) logosToLoad++;
	if(playerConfig.logo2 && playerConfig.logo2.image && playerConfig.logo2.image.length != 0) logosToLoad++;

	function tryApplyOverlays() {
		if (logosLoaded >= logosToLoad && overlays.length > 0 && !overlayApplied) {
			overlayApplied = true;
			player.overlay({
				overlays: overlays
			});
		}
	}

	if (playerConfig.logo && playerConfig.logo.image && playerConfig.logo.image.length != 0) {
		var imgTag = new Image();
		var cacheBuster = Date.now();
		imgTag.onload = function () {
			// Only proceed if image loaded successfully and has valid dimensions
			if (this.width > 0 && this.height > 0) {
				var overlay = null;
				imgTag.setAttribute('width', this.width);
				imgTag.setAttribute('height', this.height);

				if (playerConfig.logo.link.length !== 0) {
					var aTag = document.createElement('a');
					aTag.setAttribute('href', playerConfig.logo.link);
					aTag.setAttribute('target', '_blank');
					aTag.appendChild(imgTag);
					overlay = aTag.outerHTML;
				} else {
					overlay = imgTag.outerHTML;
				}

				overlays.push({
					showBackground: false,
					content: overlay,
					start: 0,
					align: playerConfig.logo.position,
				});
			}
			
			logosLoaded++;
			tryApplyOverlays();
		};
		imgTag.onerror = function() {
			logosLoaded++;
			tryApplyOverlays();
		};
		imgTag.src = playerConfig.logo.image + '?' + cacheBuster;
	}

	if (playerConfig.logo2 && playerConfig.logo2.image && playerConfig.logo2.image.length != 0) {
		var imgTag2 = new Image();
		var cacheBuster2 = Date.now();
		imgTag2.onload = function () {
			// Only proceed if image loaded successfully and has valid dimensions
			if (this.width > 0 && this.height > 0) {
				var overlay2 = null;
				imgTag2.setAttribute('width', this.width);
				imgTag2.setAttribute('height', this.height);

				if (playerConfig.logo2.link.length !== 0) {
					var aTag2 = document.createElement('a');
					aTag2.setAttribute('href', playerConfig.logo2.link);
					aTag2.setAttribute('target', '_blank');
					aTag2.appendChild(imgTag2);
					overlay2 = aTag2.outerHTML;
				} else {
					overlay2 = imgTag2.outerHTML;
				}

				overlays.push({
					showBackground: false,
					content: overlay2,
					start: 0,
					align: playerConfig.logo2.position,
				});
			}
			
			logosLoaded++;
			tryApplyOverlays();
		};
		imgTag2.onerror = function() {
			logosLoaded++;
			tryApplyOverlays();
		};
		imgTag2.src = playerConfig.logo2.image + '?' + cacheBuster2;
	}

	// Fallback timeout
	setTimeout(function() {
		tryApplyOverlays();
	}, 2000);

	if (autoplay === true) {
		// https://videojs.com/blog/autoplay-best-practices-with-video-js/
		player.play();
	}
});
