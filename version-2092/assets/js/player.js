(function() {
  window.initMoviePlayer = function(options) {
    var video = document.getElementById(options.videoId);
    var overlay = document.getElementById(options.overlayId);
    var button = document.getElementById(options.buttonId);
    var loaded = false;
    var hls = null;

    function bindSource() {
      if (!video || loaded) {
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = options.src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          maxBufferLength: 30,
          capLevelToPlayerSize: true
        });
        hls.loadSource(options.src);
        hls.attachMedia(video);
      } else {
        video.src = options.src;
      }
      loaded = true;
    }

    function start() {
      if (!video) {
        return;
      }
      bindSource();
      video.controls = true;
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      var action = video.play();
      if (action && typeof action.catch === "function") {
        action.catch(function() {
          if (overlay) {
            overlay.classList.remove("is-hidden");
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener("click", start);
    }
    if (button) {
      button.addEventListener("click", start);
    }
    if (video) {
      video.addEventListener("click", function() {
        if (video.paused) {
          start();
        }
      });
    }

    window.addEventListener("pagehide", function() {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  };
})();
