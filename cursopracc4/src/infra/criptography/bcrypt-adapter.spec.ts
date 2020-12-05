import { BcryptAdater } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hashed_password'))
  }
}))

const salt = 12

describe('Bcrypt Adapter', () => {
  test('Should call BcryptAdapter with correct password', async () => {
    const sut = new BcryptAdater(salt)

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_password')

    expect(hashSpy).toHaveBeenCalledWith('any_password', salt)
  })
})
