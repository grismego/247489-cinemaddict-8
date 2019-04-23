importScripts("precache-manifest.aff507252d63ed67b81e52fd398a11e2.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.0/workbox-sw.js");

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

