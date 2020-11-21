import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const salt = 12

    const sut = new BcryptAdapter(salt)

    const hash = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')

    expect(hash).toHaveBeenCalledWith('any_value', salt)
  })
})
