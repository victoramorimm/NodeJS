import {
  AddAccount,
  EmailValidator,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from './signup-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      const emailIsValid = this.emailValidator.isValid(email)

      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }

      if (passwordConfirmation !== password) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
