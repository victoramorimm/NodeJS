import { AccountModel } from '../../../domain/models/account'

export interface UpdateAccessTokenModel {
  id: string
  token: string
}

export interface UpdateAccessToken {
  updateAccessToken(data: UpdateAccessTokenModel): Promise<AccountModel>
}
