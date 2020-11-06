import { AccountModel } from '../models/account'

/* eslint-disable @typescript-eslint/method-signature-style */
export interface AddAccountModel {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add (account: AddAccountModel): Promise<AccountModel>
}
