import { Validation } from '@/presentation/protocols'
import { EmailValidator } from '@/validation/protocols/email-validator'
import { InvalidParamError } from '@/presentation/errors'

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
