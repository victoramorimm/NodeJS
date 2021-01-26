import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation returns fails', () => {
    const sut = new RequiredFieldValidation('field')

    const error = sut.validate({})

    expect(error).toEqual(new MissingParamError('field'))
  })
})
