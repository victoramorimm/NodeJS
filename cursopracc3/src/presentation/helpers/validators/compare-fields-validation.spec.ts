import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

describe('CompareFields Validation', () => {
  test('Should return an InvalidParamError if validation fails', () => {
    const sut = new CompareFieldsValidation('field', 'fieldToCompare')

    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'diffent_value'
    })

    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })
})
