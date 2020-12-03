import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Encrypter
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(accountData.password)

    const fakeAccount = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    }

    return new Promise(resolve => resolve(fakeAccount))
  }
}
