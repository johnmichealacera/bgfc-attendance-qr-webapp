import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      role: 'ADMIN' | 'FACULTY' | 'STUDENT'
    }
  }

  interface User {
    id: string
    name: string
    email: string
    role: 'ADMIN' | 'FACULTY' | 'STUDENT'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'ADMIN' | 'FACULTY' | 'STUDENT'
  }
}

declare module 'next-auth/core/types' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      role: 'ADMIN' | 'FACULTY' | 'STUDENT'
    }
  }
}
