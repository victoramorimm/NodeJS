import {
  Authentication,
  AuthenticationModel
} from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const { email } = authentication

    await this.loadAccountByEmailRepository.loadByEmail(email)

    return null
  }
}
