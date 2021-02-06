import { AccessDeniedError, ServerError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/account'
import { HttpRequest } from '../protocols'

export const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

export const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    load(accessToken: string, role?: string): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()

      return new Promise((resolve) => resolve(fakeAccount))
    }
  }

  return new LoadAccountByTokenStub()
}

export interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()

  const sut = new AuthMiddleware(loadAccountByTokenStub)

  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

    const fakeRequest = makeFakeRequest()

    await sut.handle(fakeRequest)

    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()

    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const fakeRequest = makeFakeRequest()

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()

    const fakeRequest = makeFakeRequest()

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(
      ok({
        accountId: 'any_id'
      })
    )
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()

    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const fakeRequest = makeFakeRequest()

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
