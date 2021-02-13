import { Encrypter } from '@/data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
import { Decrypter } from '@/data/protocols/criptography/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const accessToken = jwt.sign({ id: value }, this.secret)

    return new Promise((resolve) => resolve(accessToken))
  }

  async decrypt(token: string): Promise<string> {
    const value: any = jwt.verify(token, this.secret)

    return value
  }
}
