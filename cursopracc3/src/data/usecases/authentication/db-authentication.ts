import {
  Authentication,
  AuthenticationModel,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  private readonly hashComparerStub: HashComparer

  private readonly encrypter: Encrypter

  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparerStub: HashComparer,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository

    this.hashComparerStub = hashComparerStub

    this.encrypter = encrypter

    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication

    const account = await this.loadAccountByEmailRepository.load(email)

    if (!account) {
      return null
    }

    const isHashValid = await this.hashComparerStub.compare(
      password,
      account.password
    )

    if (!isHashValid) {
      return null
    }

    const accessToken = await this.encrypter.encrypt(account.id)

    await this.updateAccessTokenRepository.update(account.id, accessToken)

    return accessToken
  }
}
