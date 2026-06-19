import { H as Hls } from './hls.js';

const players = Array.from(document.querySelectorAll('[data-player]'));

const setupPlayer = (player) => {
  const video = player.querySelector('video');
  const playButton = player.querySelector('[data-play-button]');

  if (!video || !playButton) {
    return;
  }

  const source = video.getAttribute('data-src');
  let initialized = false;
  let hlsInstance = null;

  const initialize = () => {
    if (initialized || !source) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }

    initialized = true;
  };

  const play = async () => {
    initialize();
    playButton.classList.add('is-hidden');

    try {
      await video.play();
    } catch (error) {
      playButton.classList.remove('is-hidden');
    }
  };

  playButton.addEventListener('click', play);
  video.addEventListener('click', () => {
    if (video.paused) {
      play();
    }
  });
  video.addEventListener('play', () => {
    playButton.classList.add('is-hidden');
  });
  video.addEventListener('pause', () => {
    if (!video.ended) {
      playButton.classList.remove('is-hidden');
    }
  });
  video.addEventListener('ended', () => {
    playButton.classList.remove('is-hidden');
  });
  window.addEventListener('pagehide', () => {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
};

players.forEach(setupPlayer);
