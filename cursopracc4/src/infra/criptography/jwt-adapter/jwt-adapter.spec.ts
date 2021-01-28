import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise((resolve) => resolve('any_token'))
  }
}))

describe('JwtAdapter', () => {
  test('Should call sign() with correct values', async () => {
    const secret = 'any_secret'

    const sut = new JwtAdapter(secret)

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_id')

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, secret)
  })
})
