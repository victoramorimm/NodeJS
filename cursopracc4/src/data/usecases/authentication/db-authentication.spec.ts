import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct values', async () => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository {
      async loadByEmail(email: string): Promise<AccountModel> {
        const fakeAccount = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password'
        }

        return new Promise((resolve) => resolve(fakeAccount))
      }
    }

    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()

    const loadByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    )

    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)

    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
