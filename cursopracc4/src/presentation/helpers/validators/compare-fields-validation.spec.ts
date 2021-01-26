import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

describe('CompareFields Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = new CompareFieldsValidation('field', 'fieldToCompare')

    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'different_value'
    })

    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })
})
