import { DbAddAccount } from './db-add-account'
import {
  Hasher,
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

  const makeHasherStub = (): Hasher => {
    class HasherStub {
      async hash(password: string): Promise<string> {
        return new Promise((resolve) => resolve('hashed_password'))
      }
    }
    return new HasherStub()
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
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
  }

  const makeSut = (): SutTypes => {
    const hasherStub = makeHasherStub()

    const addAccountRepositoryStub = makeAddAccountRepositoryStub()

    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)

    return {
      sut,
      hasherStub,
      addAccountRepositoryStub
    }
  }

  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()

    const HasherSpy = jest.spyOn(hasherStub, 'hash')

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }

    await sut.add(accountData)

    expect(HasherSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()

    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => {
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
