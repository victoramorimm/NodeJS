import { AccountModel } from '../../account/account-model'

export interface LoadAccountByTokenRepository {
  loadByToken(value: string, role?: string): Promise<AccountModel>
}
