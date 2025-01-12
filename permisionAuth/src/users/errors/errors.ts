export class UserNotFound extends Error {
  constructor(message: string = 'User not found') {
    super(message)
    this.name = 'UserNotFound'
  }
}
