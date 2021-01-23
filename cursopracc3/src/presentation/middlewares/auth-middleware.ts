import {
  LoadAccountByToken,
  HttpRequest,
  HttpResponse,
  Middleware,
} from './auth-middleware-protocols'
import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      /**
       * As únicas chances de acontecer um Forbidden são:
       *  1. O Access Token não ser provido pelo header
       *  2. O processo de encontrar uma conta com o token provido falhar.
       */
      const accessToken = httpRequest.headers?.['x-access-token']

      if (accessToken) {
        const account = await this.loadAccountByToken.load(
          accessToken,
          this.role
        )

        if (account) {
          return ok({ accountId: account.id })
        }
      }

      const error = forbidden(new AccessDeniedError())

      return await new Promise((resolve) => resolve(error))
    } catch (error) {
      return serverError(error)
    }
  }
}
