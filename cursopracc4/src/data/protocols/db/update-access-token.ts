import { AccountModel } from '../../../domain/models/account'

export interface UpdateAccessToken {
  update(id: string, token: string): Promise<AccountModel>
}
