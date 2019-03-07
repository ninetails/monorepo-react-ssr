import { renderToString } from 'react-dom/server'

export default async function renderContent (app) {
  try {
    return renderToString(app)
  } catch (err) {
    if (err instanceof Promise) {
      try {
        await err

        return renderContent(app)
      } catch (rejectedError) {
        throw rejectedError
      }
    }

    throw err
  }
}
