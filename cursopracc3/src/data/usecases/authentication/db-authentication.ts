import {
  Authentication,
  AuthenticationModel,
  HashComparer,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparerStub: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication

    const account = await this.loadAccountByEmailRepository.loadByEmail(email)

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

    await this.updateAccessTokenRepository.updateAccessToken(
      account.id,
      accessToken
    )

    return accessToken
  }
}
