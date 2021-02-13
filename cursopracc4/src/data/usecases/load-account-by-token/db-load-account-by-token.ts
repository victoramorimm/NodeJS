import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { AccountModel } from '@/data/protocols/account/account-model'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(value: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(value)

    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        value,
        role
      )

      if (account) {
        return account
      }
    }

    return null
  }
}
