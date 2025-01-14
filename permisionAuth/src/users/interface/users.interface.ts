export type UserRole = 'ADMIN' | 'USER' | 'MODERATOR'

export interface User {
  id: number
  name: string
  email: string
  password: string
  role: UserRole
}

export type UserSafe = Omit<User, 'password'>

export interface UserUpdate {
  name?: string
  email?: string
  plainPassword?: string
  role?: UserRole
}

export interface UserCreate {
  name: string
  email: string
  plainPassword: string
  role: UserRole
}

export interface UserServices {
  create(user: UserCreate): Promise<UserSafe>
  findUsers(limit?: number, offset?: number): Promise<UserSafe[]>
  findUserById(id: number): Promise<UserSafe | null>
  findUserByEmail(email: string): Promise<UserSafe | null>
  updateUser(id: number, user: UserUpdate): Promise<UserSafe>
  deleteUser(id: number): Promise<boolean>
}
