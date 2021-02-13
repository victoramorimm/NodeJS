import { AccountModel } from '@/data/protocols/account/account-model'

export interface LoadAccountByTokenRepository {
  loadByToken(value: string, role?: string): Promise<AccountModel>
}
