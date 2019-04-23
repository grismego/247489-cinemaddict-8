const CACHE_NAME = `myCache`;

const regExpWebpack = /sockjs-node/g;

const urlCanBeCached = (url) => {
  return !regExpWebpack.test(url);
};

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll([
        `./bundle.js`,
        `./index.html`,
        `./css/main.css`,
        `./css/normalize.css`,
        `./images/background.png`,
        `./images/icon-favorite.png`,
        `./images/icon-favorite.svg`,
        `./images/icon-watched.png`,
        `./images/icon-watched.svg`,
        `./images/icon-watchlist.png`,
        `./images/icon-watchlist.svg`,
        `./images/posters/accused.jpg`,
        `./images/posters/blackmail.jpg`,
        `./images/posters/blue-blazes.jpg`,
        `./images/posters/fuga-da-new-york.jpg`,
        `./images/posters/moonrise.jpg`,
        `./images/posters/three-friends.jpg`
      ]))
      .catch((err) => {
        throw err;
      })
  );
});

self.addEventListener(`fetch`, (event) =>
  event.respondWith(
      caches
        .open(CACHE_NAME)
        .then((cache) => cache.match(event.request, {ignoreSearch: true}))
        .then((response) => response || fetch(event.request))
  )
);
