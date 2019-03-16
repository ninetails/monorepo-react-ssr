if ('workbox' in self) {
  const manifest = [
    '/',
    '/favicon.ico'
  ].concat(self.__precacheManifest || [])

  // eslint-disable-next-line no-undef
  workbox.precaching.precacheAndRoute(manifest, {
    cleanUrls: false,
    directoryIndex: null
  })

  // eslint-disable-next-line no-undef
  workbox.routing.registerNavigationRoute('/')
}
