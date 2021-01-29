import {
  AddAccountRepository,
  AccountModel,
  AddAccount,
  AddAccountModel,
  Hasher
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)

    /**
     * Criando um objeto novo com os mesmos valores do AccountData,
     * porém modificando o password
     */
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword })
    )

    return account
  }
}
