(function () {
    window.initVideoPlayer = function (videoId, layerId, messageId, streamUrl) {
        var video = document.getElementById(videoId);
        var layer = document.getElementById(layerId);
        var message = document.getElementById(messageId);
        var hls = null;
        var ready = false;

        if (!video || !streamUrl) {
            return;
        }

        function showMessage() {
            if (message) {
                message.hidden = false;
            }
        }

        function prepare() {
            if (ready) {
                return true;
            }

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                ready = true;
                return true;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        showMessage();
                    }
                });
                ready = true;
                return true;
            }

            showMessage();
            return false;
        }

        function play() {
            if (!prepare()) {
                return;
            }

            if (layer) {
                layer.classList.add("is-hidden");
            }

            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {
                    if (layer) {
                        layer.classList.remove("is-hidden");
                    }
                });
            }
        }

        prepare();

        if (layer) {
            layer.addEventListener("click", play);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });

        video.addEventListener("play", function () {
            if (layer) {
                layer.classList.add("is-hidden");
            }
        });

        video.addEventListener("pause", function () {
            if (layer && video.currentTime === 0) {
                layer.classList.remove("is-hidden");
            }
        });

        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    };
}());
