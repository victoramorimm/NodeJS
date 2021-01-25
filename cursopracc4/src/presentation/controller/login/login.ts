import {
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator
} from './login-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import {
  badRequest,
  serverError,
  unauthorized
} from '../../helpers/http-helper'

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = httpRequest.body

      const isEmailValid = this.emailValidator.isValid(email)

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const isAccessToken = await this.authentication.auth({
        email,
        password
      })

      if (!isAccessToken) {
        return unauthorized()
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
