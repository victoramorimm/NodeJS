import { DbAddAccount } from './db-add-account'
import {
  LoadAccountByEmailRepository,
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

  const makeHasher = (): Hasher => {
    class HasherStub {
      async hash(password: string): Promise<string> {
        return new Promise((resolve) => resolve('hashed_password'))
      }
    }
    return new HasherStub()
  }

  const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub {
      async add(account: AddAccountModel): Promise<AccountModel> {
        const fakeAccount = makeFakeAccount()

        return new Promise((resolve) => resolve(fakeAccount))
      }
    }

    return new AddAccountRepositoryStub()
  }

  const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository {
      async loadByEmail(email: string): Promise<AccountModel> {
        return new Promise((resolve) => resolve(null))
      }
    }

    return new LoadAccountByEmailRepositoryStub()
  }

  type SutTypes = {
    sut: DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  }

  const makeSut = (): SutTypes => {
    const hasherStub = makeHasher()

    const addAccountRepositoryStub = makeAddAccountRepository()

    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()

    const sut = new DbAddAccount(
      hasherStub,
      addAccountRepositoryStub,
      loadAccountByEmailRepositoryStub
    )

    return {
      sut,
      hasherStub,
      addAccountRepositoryStub,
      loadAccountByEmailRepositoryStub
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

  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const fakeAccount = makeFakeAccount()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(new Promise((resolve) => resolve(fakeAccount)))

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }

    const account = await sut.add(accountData)

    expect(account).toBeNull()
  })

  test('Should call LoadAccountByEmailRepository with correct value', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    )

    const fakeAccountData = makeFakeAccountData()

    await sut.add(fakeAccountData)

    expect(loadByEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
})
