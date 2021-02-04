import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Should return an account on add success', async () => {
    const sut = makeSut()

    const account = await sut.add({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('valid_name')
    expect(account.email).toBe('valid_email@mail.com')
    expect(account.password).toBe('hashed_password')
  })

  test('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()

    await accountCollection.insertOne({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })

    const account = await sut.loadByEmail('valid_email@mail.com')

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('valid_name')
    expect(account.email).toBe('valid_email@mail.com')
    expect(account.password).toBe('hashed_password')
  })

  test('Should return null if loadByEmail fails', async () => {
    const sut = makeSut()

    const account = await sut.loadByEmail('valid_email@mail.com')

    expect(account).toBeFalsy()
  })

  test('Should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut()

    const result = await accountCollection.insertOne({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })

    // result.ops[0] = Conta do usuário.
    const { _id, accessToken } = result.ops[0]

    expect(accessToken).toBeFalsy()

    await sut.updateAccessToken({
      id: _id,
      token: 'any_token'
    })

    const account = await accountCollection.findOne({ _id })

    expect(account).toBeTruthy()
    expect(account.accessToken).toBe('any_token')
  })
})
