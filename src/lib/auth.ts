import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const hasDatabase = Boolean(process.env.DATABASE_URL)

export const authOptions: NextAuthOptions = {
  ...(hasDatabase ? { adapter: PrismaAdapter(prisma) } : {}),
  session: hasDatabase ? undefined : { strategy: 'jwt' },
  providers:
    googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          }),
        ]
      : [],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    session({ session, user, token }) {
      if (session.user) {
        session.user.id = hasDatabase ? user.id : (token.sub ?? '')
      }
      return session
    },
  },
}
