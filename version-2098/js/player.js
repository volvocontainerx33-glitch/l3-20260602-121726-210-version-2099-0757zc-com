(function () {
    function start(box) {
        var video = box.querySelector('video');
        var button = box.querySelector('[data-play-button]');
        var streamUrl = box.getAttribute('data-stream');

        if (!video || !streamUrl) {
            return;
        }

        if (button) {
            button.classList.add('is-hidden');
        }

        video.controls = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            if (video.getAttribute('src') !== streamUrl) {
                video.src = streamUrl;
            }
        } else if (window.Hls && window.Hls.isSupported()) {
            if (!box.hlsInstance) {
                box.hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                box.hlsInstance.loadSource(streamUrl);
                box.hlsInstance.attachMedia(video);
            }
        } else {
            video.src = streamUrl;
        }

        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                if (button) {
                    button.classList.remove('is-hidden');
                }
            });
        }
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (box) {
        var button = box.querySelector('[data-play-button]');
        var video = box.querySelector('video');

        if (button) {
            button.addEventListener('click', function () {
                start(box);
            });
        }

        if (video) {
            video.addEventListener('click', function () {
                if (!video.currentSrc) {
                    start(box);
                }
            });
        }
    });
})();
