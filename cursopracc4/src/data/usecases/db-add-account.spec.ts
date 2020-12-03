import { Encrypter } from '../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

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
})
