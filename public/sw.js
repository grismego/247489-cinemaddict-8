importScripts("precache-manifest.29a96a90bced1441cc498743ec233a04.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.0/workbox-sw.js");

// workbox.core.skipWaiting();
// workbox.core.clientsClaim();

// // workbox.routing.registerRoute(
// //   new RegExp(`https://es8-demo-srv.appspot.com/moowle/movies`),
// //   new workbox.strategies.StaleWhileRevalidate({
// //   })
// // );

// if (workbox) {
//   registerRoutes();
// } else {
//   console.log('Oh, workbox did not load')
// }

// function registerRoutes() {
//   workbox.routing.registerRoute('.*\.*');
// }

// workbox.precaching.precacheAndRoute(self.__precacheManifest);


// const CACHE = `cache-and-update-v1`;

// // При установке воркера мы должны закешировать часть данных (статику).
// self.addEventListener(`install`, (evt) => {
//   evt.waitUntil(
//       caches.open(CACHE).then((cache) =>
//         cache.addAll([
//           `./`,
//           `./index.html`,
//           `./bundle.js`,
//           `./css/main.css`,
//           `./css/normalize.css`,
//           `/images/`,
//           `/images/posters/`
//         ]))
//   );
// });

// self.addEventListener(`activate`, (evt) => {
//   console.log(`sw`, `activate`, {evt});
// });

// self.addEventListener(`fetch`, (evt) => {
//   evt.respondWith(
//       caches.match(evt.request).then((response) => {
//         if (response) {
//           return response;
//         } else {
//           return fetch(evt.request)
//         .then((response) => {
//           caches.open(CACHE)
//           .then((cache) => cache.put(evt.request, response.clone()));

//           return response.clone();
//         });
//         }
//       })
//     .catch((err) => console.error({err}))
//   );
// });

// // self.addEventListener('fetch', (evt) => {
// //   console.log('fetch', {evt, request: evt.request});
// //   evt.respondWith(
// //     caches.match(evt.request)
// //       .then((response) => {
// //         console.log(`Find in cache`, {response});
// //         if (response) {
// //           return response;
// //         } else {
// //           return fetch(evt.request)
// //             .then(function(response) {
// //               caches.open(CACHE)
// //                 .then((cache) => cache.put(evt.request, response.clone()));

// //               return response.clone();
// //             });
// //         }
// //       })
// //       .catch((err) => console.error({err}))
// //   );
// // });

// // self.addEventListener('fetch', function(event) {
// //   // Мы используем `respondWith()`, чтобы мгновенно ответить без ожидания ответа с сервера.
// //   event.respondWith(fromCache(event.request));
// //   // `waitUntil()` нужен, чтобы предотвратить прекращение работы worker'a до того как кэш обновиться.
// //   event.waitUntil(update(event.request));
// // });

// // self.addEventListener(`fetch`, (evt) => {
// //   console.log(`fetch`, {evt, request: evt.request});
// //   evt.respondWith(
// //     caches.match(evt.request)
// //       .then((response) => {
// //         console.log(`Find in cache`, {response});
// //         if (response) {
// //           return response;
// //         } else {
// //           return fetch(evt.request)
// //             .then((response) => {
// //               caches.open(CACHE)
// //                 .then((cache) => cache.put(evt.request, response.clone()));

// //               return response.clone();
// //             });
// //         }
// //       })
// //       .catch((err) => console.error({err}))
// //   );
// // });

workbox.core.skipWaiting();
workbox.core.clientsClaim();


const cacheName = 'CACHE-v1'

workbox.router.registerRoute(/\.(?:css|html)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'static-resources'
  })
);

workbox.router.registerRoute(
    new RegExp('bundle.js'),
    workbox.strategies.networkFirst()
);

workbox.router.registerRoute(/\.(?:png|gif|jpg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images-cache'
  })
);

