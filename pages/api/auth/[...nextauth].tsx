import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/libs/prismadb"
import bcrypt from "bcrypt"


export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid username or password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid username or password");
        }

        // Add your password comparison logic here, e.g., using bcrypt
        const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isValidPassword) {
          throw new Error("Invalid username or password");
        }

        return user;
      }
    })
  ],
  pages: {signIn: "/login"},
  debug: process.env.NODE_ENV === "development",
  session: {strategy: "jwt"},
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
}

export default NextAuth(authOptions);
