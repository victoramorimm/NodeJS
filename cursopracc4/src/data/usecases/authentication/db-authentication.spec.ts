import { DbAuthentication } from './db-authentication'
import {
  AccountModel,
  HashComparer,
  HashComparerModel,
  AuthenticationModel,
  TokenGenerator,
  LoadAccountByEmailRepository,
  UpdateAccessToken
} from './db-authentication-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()

      return new Promise((resolve) => resolve(fakeAccount))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(data: HashComparerModel): Promise<boolean> {
      return new Promise((resolve) => resolve(true))
    }
  }

  return new HashComparerStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(id: string): Promise<string> {
      return 'any_token'
    }
  }

  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessToken => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessToken {
    async update(id: string, token: string): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()
      return new Promise((resolve) => resolve(fakeAccount))
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessToken
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()

  const hashComparerStub = makeHashComparer()

  const tokenGeneratorStub = makeTokenGenerator()

  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct values', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    )

    const fakeAuthentication = makeFakeAuthentication()

    await sut.auth(fakeAuthentication)

    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const fakeAuthentication = makeFakeAuthentication()

    const promise = sut.auth(fakeAuthentication)

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository fails', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null)

    const fakeAuthentication = makeFakeAuthentication()

    const accessToken = await sut.auth(fakeAuthentication)

    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()

    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    const fakeAuthentication = makeFakeAuthentication()

    await sut.auth(fakeAuthentication)

    expect(compareSpy).toHaveBeenCalledWith({
      value: 'any_password',
      hashToCompare: 'hashed_password'
    })
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const fakeAuthentication = makeFakeAuthentication()

    const promise = sut.auth(fakeAuthentication)

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer false', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)))

    const fakeAuthentication = makeFakeAuthentication()

    const accessToken = await sut.auth(fakeAuthentication)

    expect(accessToken).toBeNull()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')

    const fakeAuthentication = makeFakeAuthentication()

    await sut.auth(fakeAuthentication)

    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    jest
      .spyOn(tokenGeneratorStub, 'generate')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const fakeAuthentication = makeFakeAuthentication()

    const promise = sut.auth(fakeAuthentication)

    await expect(promise).rejects.toThrow()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut } = makeSut()

    const fakeAuthentication = makeFakeAuthentication()

    const accessToken = await sut.auth(fakeAuthentication)

    expect(accessToken).toEqual('any_token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')

    const fakeAuthentication = makeFakeAuthentication()

    await sut.auth(fakeAuthentication)

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    jest
      .spyOn(updateAccessTokenRepositoryStub, 'update')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const fakeAuthentication = makeFakeAuthentication()

    const promise = sut.auth(fakeAuthentication)

    await expect(promise).rejects.toThrow()
  })
})
