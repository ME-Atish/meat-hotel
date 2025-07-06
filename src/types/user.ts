enum Role {
  USER,
  ADMIN
}

export interface User {
  _id: string,
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  isOwner: boolean,
  role: Role 
}