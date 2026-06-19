(function () {
  function setStream(video, url) {
    if (!video || !url || video.getAttribute('data-ready') === '1') {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.setAttribute('data-ready', '1');
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      video.hlsInstance = hls;
      video.setAttribute('data-ready', '1');
      return;
    }

    video.src = url;
    video.setAttribute('data-ready', '1');
  }

  function bindPlayer(panel) {
    var video = panel.querySelector('video');
    var overlay = panel.querySelector('.watch-overlay');
    var button = panel.querySelector('.play-button');
    var stream = panel.getAttribute('data-stream-url');

    function start(event) {
      if (event) {
        event.preventDefault();
      }
      setStream(video, stream);
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      if (video) {
        video.setAttribute('controls', 'controls');
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {
            video.muted = true;
            video.play();
          });
        }
      }
    }

    if (overlay) {
      overlay.addEventListener('click', start);
    }
    if (button) {
      button.addEventListener('click', start);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('.player-panel')).forEach(bindPlayer);
  });
})();
