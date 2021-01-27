import {
  Authentication,
  AuthenticationModel
} from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email'
import { UpdateAccessToken } from '../../protocols/db/update-access-token'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessToken
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication

    const account = await this.loadAccountByEmailRepository.loadByEmail(email)

    if (account) {
      const isValid = await this.hashComparer.compare({
        value: password,
        hashToCompare: account.password
      })

      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id)

        await this.updateAccessTokenRepository.update(account.id, accessToken)

        return accessToken
      }
    }

    return null
  }
}
