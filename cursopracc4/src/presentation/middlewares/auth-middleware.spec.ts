import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/account'

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      load(accessToken: string, role?: string): Promise<AccountModel> {
        const fakeAccount: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password'
        }

        return new Promise((resolve) => resolve(fakeAccount))
      }
    }

    const loadAccountByTokenStub = new LoadAccountByTokenStub()

    const sut = new AuthMiddleware(loadAccountByTokenStub)

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      load(accessToken: string, role?: string): Promise<AccountModel> {
        const fakeAccount: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password'
        }

        return new Promise((resolve) => resolve(fakeAccount))
      }
    }

    const loadAccountByTokenStub = new LoadAccountByTokenStub()

    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

    const sut = new AuthMiddleware(loadAccountByTokenStub)

    await sut.handle({
      headers: {
        'x-access-token': 'any_token'
      }
    })

    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
