import { DbAddAccount } from './db-add-account'
import {
  Encrypter,
  AddAccountModel,
  AccountModel,
  AddAccountRepository
} from './db-add-account-protocols'

describe('DbAddAccount Usecase', () => {
  const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  })

  const makeFakeAccountData = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'hashed_password'
  })

  const makeEncrypterStub = (): Encrypter => {
    class EncrypterStub {
      async encrypt(password: string): Promise<string> {
        return new Promise((resolve) => resolve('hashed_password'))
      }
    }
    return new EncrypterStub()
  }

  const makeAddAccountRepositoryStub = (): AddAccountRepository => {
    class AddAccountRepositoryStub {
      async add(account: AddAccountModel): Promise<AccountModel> {
        const fakeAccount = makeFakeAccount()

        return fakeAccount
      }
    }

    return new AddAccountRepositoryStub()
  }

  interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
  }

  const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypterStub()

    const addAccountRepositoryStub = makeAddAccountRepositoryStub()

    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

    return {
      sut,
      encrypterStub,
      addAccountRepositoryStub
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

    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const accountData = makeFakeAccountData()

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const accountData = makeFakeAccountData()

    await sut.add(accountData)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const accountData = makeFakeAccountData()

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }

    const account = await sut.add(accountData)

    const fakeAccount = makeFakeAccount()

    expect(account).toEqual(fakeAccount)
  })
})
