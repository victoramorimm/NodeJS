import { DbAddAccount } from './db-add-account'
import { Encrypter } from './db-add-account-protocols'

describe('DbAddAccount Usecase', () => {
  interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
  }

  const makeEncrypterStub = (): Encrypter => {
    class EncrypterStub {
      async encrypt (password: string): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'))
      }
    }

    return new EncrypterStub()
  }

  const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypterStub()

    const sut = new DbAddAccount(encrypterStub)

    return {
      sut,
      encrypterStub
    }
  }

  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()

    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }

    await sut.add(accountData)

    expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt')
      .mockImplementationOnce(() => {
        return new Promise((resolve, reject) => reject(new Error()))
      })

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })
})
