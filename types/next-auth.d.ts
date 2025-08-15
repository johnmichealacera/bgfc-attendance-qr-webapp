import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: 'ADMIN' | 'FACULTY' | 'STUDENT'
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: 'ADMIN' | 'FACULTY' | 'STUDENT'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'ADMIN' | 'FACULTY' | 'STUDENT'
  }
}
