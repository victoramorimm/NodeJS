import bcrypt from 'bcrypt'
import {
  HashComparer,
  HashComparerModel
} from '../../../data/protocols/criptography/hash-comparer'
import { Hasher } from '../../../data/protocols/criptography/hasher'

export class BcryptAdapter implements Hasher, HashComparer {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  async hash(value: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(value, this.salt)

    return hashedPassword
  }

  async compare(data: HashComparerModel): Promise<boolean> {
    const { value, hashToCompare } = data

    const isValid = await bcrypt.compare(value, hashToCompare)

    return isValid
  }
}
