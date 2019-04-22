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
