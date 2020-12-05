import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  }
}))

const salt = 12

describe('Bcrypt Adapter', () => {
  test('Should call BcryptAdapter with correct values', async () => {
    const sut = new BcryptAdapter(salt)

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_password')

    expect(hashSpy).toHaveBeenCalledWith('any_password', salt)
  })

  test('Should return a hash on success', async () => {
    const sut = new BcryptAdapter(salt)

    const hashedPassword = await sut.encrypt('any_password')

    expect(hashedPassword).toBe('hash')
  })
})
