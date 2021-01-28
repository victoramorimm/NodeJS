import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash'))
  },

  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true))
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const sut = makeSut()

      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await sut.hash('any_password')

      expect(hashSpy).toHaveBeenCalledWith('any_password', salt)
    })

    test('Should return a valid hash on hash success', async () => {
      const sut = makeSut()

      const hashedPassword = await sut.hash('any_password')

      expect(hashedPassword).toBe('hash')
    })

    test('Should throw if bcrypt throws', async () => {
      const sut = makeSut()

      jest
        .spyOn(bcrypt, 'hash')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error()))
        )

      const promise = sut.hash('any_password')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut()

      const compareSpy = jest.spyOn(bcrypt, 'compare')

      await sut.compare({
        value: 'any_password',
        hashToCompare: 'hashed_password'
      })

      expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
    })
  })
})
