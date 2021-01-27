import { EmailValidation } from '../../../presentation/helpers/http/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/http/validators/required-field-validation'
import { Validation } from '../../../presentation/helpers/http/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/http/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
