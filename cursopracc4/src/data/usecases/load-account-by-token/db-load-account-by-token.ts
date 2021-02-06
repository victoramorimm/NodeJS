import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../protocols/account/account-model'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(value: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(value)

    if (token) {
      await this.loadAccountByTokenRepository.loadByToken(value, role)
    }

    return null
  }
}
