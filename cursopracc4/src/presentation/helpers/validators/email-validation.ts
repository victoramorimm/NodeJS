import { Validation } from './validation'
import { EmailValidator } from '../../protocols/email-validator'
import { InvalidParamError } from '../../errors'

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate(input: any): Error {
    const emailIsValid = this.emailValidator.isValid(input[this.fieldName])

    if (!emailIsValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
