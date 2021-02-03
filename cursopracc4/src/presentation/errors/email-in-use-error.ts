export class EmailInUse extends Error {
  constructor() {
    super('Email already in use!')
    this.name = 'EmailInUse'
  }
}
