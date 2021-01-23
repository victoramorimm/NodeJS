import { Express, Router } from 'express'
import fg from 'fast-glob'

export default (app: Express): void => {
  const router = Router()

  app.use('/api', router)

  // Automatizando o import dos routes no nosso Router.
  fg.sync('**/src/main/routes/**routes.ts').map(async (file) => {
    ;(await import(`../../../${file}`)).default(router)
  })
}
