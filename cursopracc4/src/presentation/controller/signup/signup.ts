import {
  AddAccount,
  EmailValidator,
  Controller,
  HttpRequest,
  HttpResponse
} from './signup-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import env from '../../../main/config/env'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await MongoHelper.connect(env.mongoUrl)
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
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
