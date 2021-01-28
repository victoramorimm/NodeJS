import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'
import { HashComparerModel } from '../../data/protocols/criptography/hash-comparer'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash'))
  },

  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true))
  }
}))

const makeFakeData = (): HashComparerModel => ({
  value: 'any_password',
  hashToCompare: 'hashed_password'
})

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

    test('Should throw if hash throws', async () => {
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

      const fakeData = makeFakeData()

      await sut.compare(fakeData)

      expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
    })

    test('Should return true when compare succeeds', async () => {
      const sut = makeSut()

      const fakeData = makeFakeData()

      const isValid = await sut.compare(fakeData)

      expect(isValid).toBe(true)
    })

    test('Should return false when compare fails', async () => {
      const sut = makeSut()

      jest
        .spyOn(bcrypt, 'compare')
        .mockReturnValueOnce(new Promise((resolve) => resolve(false)))

      const fakeData = makeFakeData()

      const isValid = await sut.compare(fakeData)

      expect(isValid).toBe(false)
    })

    test('Should throw if compare throws', async () => {
      const sut = makeSut()

      jest
        .spyOn(bcrypt, 'compare')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error()))
        )

      const fakeData = makeFakeData()

      const promise = sut.compare(fakeData)

      await expect(promise).rejects.toThrow()
    })
  })
})
