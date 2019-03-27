import pino from '@ninetails-monorepo-react-ssr/logger'

const logger = pino.child({ client: true })

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => logger.info({ registration }, 'SW registered'))
        .catch(error => logger.info({ error }, 'SW registration failed'))
    })
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration =>
      registration.unregister()
    )
  }
}
