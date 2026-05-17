import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Senha", type: "password" },
                loginType: { label: "Tipo de Login", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Dados inválidos")
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user || !user?.password) {
                    throw new Error("Usuário não encontrado")
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isCorrectPassword) {
                    throw new Error("Senha incorreta")
                }

                if (credentials?.loginType === "cliente" && user.role !== "CLIENTE") {
                    throw new Error("Atenção: Área de clientes. Colaboradores devem entrar pelo painel de equipe.")
                }

                if (credentials?.loginType === "colaborador" && user.role === "CLIENTE") {
                    throw new Error("Atenção: Área de equipe. Clientes devem entrar pelo Portal do Cliente.")
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    company: user.company,
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
                token.company = (user as any).company
            }
            return token
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role as string
                session.user.id = token.id as string
                session.user.company = token.company as string | null | undefined
            }
            return session
        }
    },
    pages: {
        signIn: '/login', // TODO: create login page
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}
