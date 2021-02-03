import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  UpdateAccessTokenModel,
  AccountModel,
  AddAccountModel
} from './account-mongo-repository-protocols'

import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)

    const account = result.ops[0]

    return MongoHelper.map(account)
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({ email })

    return account && MongoHelper.map(account)
  }

  async updateAccessToken(data: UpdateAccessTokenModel): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const { id, token } = data

    accountCollection.updateOne(
      { _id: id },
      {
        $set: {
          accessToken: token
        }
      }
    )

    return new Promise((resolve) => resolve())
  }
}
