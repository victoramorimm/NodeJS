import { AccountModel } from '../../../domain/models/account'

export interface UpdateAccessTokenModel {
  id: string
  token: string
}

export interface UpdateAccessToken {
  update(data: UpdateAccessTokenModel): Promise<AccountModel>
}
