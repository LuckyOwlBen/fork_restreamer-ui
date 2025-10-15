import React from 'react';

import VideoJS from './videojs';

export default function Player({
	type = 'videojs-internal',
	source = '',
	poster = '',
	controls = false,
	autoplay = false,
	mute = false,
	logo = {
		image: '',
		position: 'top-right',
		link: '',
	},
	logo2 = {
		image: '',
		position: 'top-left',
		link: '',
	},
	ga = {
		account: '',
		name: '',
	},
	colors = {
		seekbar: '#fff',
		buttons: '#fff',
	},
	statistics = false,
}) {
	type = type ? type : 'videojs-internal';

	if (type === 'videojs-internal' || type === 'videojs-public') {
		const config = {
			controls: controls,
			poster: poster,
			autoplay: type === 'videojs-internal' ? true : autoplay ? (mute === 'muted' ? true : false) : false,
			muted: type === 'videojs-internal' ? 'muted' : mute,
			liveui: true,
			responsive: true,
			fluid: true,
			plugins: {
				reloadSourceOnError: {},
			},
			sources: [{ src: source, type: 'application/x-mpegURL' }],
		};

		return (
			<VideoJS
				type={type}
				options={config}
				onReady={async (player) => {
					const overlays = [];

					// Function to load image synchronously
					const loadImage = (src) => {
						return new Promise((resolve, reject) => {
							const img = new Image();
							img.onload = () => resolve(img);
							img.onerror = reject;
							img.src = src + '?' + Math.random();
						});
					};

					// Load logo if specified
					if (logo.image.length !== 0) {
						try {
							const imgTag = await loadImage(logo.image);
							imgTag.setAttribute('width', imgTag.width);
							imgTag.setAttribute('height', imgTag.height);

							let overlay;
							if (logo.link.length !== 0) {
								const aTag = document.createElement('a');
								aTag.setAttribute('href', logo.link);
								aTag.setAttribute('target', '_blank');
								aTag.appendChild(imgTag);
								overlay = aTag.outerHTML;
							} else {
								overlay = imgTag.outerHTML;
							}

							overlays.push({
								showBackground: false,
								content: overlay,
								start: 'play',
								end: 'pause',
								align: logo.position,
							});
						} catch (e) {
							// Logo failed to load, continue without it
						}
					}

					// Load logo2 if specified
					if (logo2.image.length !== 0) {
						try {
							const imgTag2 = await loadImage(logo2.image);
							imgTag2.setAttribute('width', imgTag2.width);
							imgTag2.setAttribute('height', imgTag2.height);

							let overlay2;
							if (logo2.link.length !== 0) {
								const aTag2 = document.createElement('a');
								aTag2.setAttribute('href', logo2.link);
								aTag2.setAttribute('target', '_blank');
								aTag2.appendChild(imgTag2);
								overlay2 = aTag2.outerHTML;
							} else {
								overlay2 = imgTag2.outerHTML;
							}

							overlays.push({
								showBackground: false,
								content: overlay2,
								start: 'play',
								end: 'pause',
								align: logo2.position,
							});
						} catch (e) {
							// Logo2 failed to load, continue without it
						}
					}

					// Apply overlays after all images are loaded
					if (overlays.length > 0 && player.overlay) {
						player.overlay({
							overlays: overlays,
						});
					}

					if (autoplay === true) {
						// https://videojs.com/blog/autoplay-best-practices-with-video-js/
						const p = player.play();

						if (!p) {
							// no autoplay;
						} else {
							p.then(
								() => {
									// autoplay worked;
								},
								() => {
									// autoplay did not work
								},
							);
						}
					}
				}}
			/>
		);
	}
}
