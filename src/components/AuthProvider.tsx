"use client"

import { SessionProvider } from "next-auth/react"
import { SessionWatcher } from "./SessionWatcher"

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider>
            <SessionWatcher />
            {children}
        </SessionProvider>
    )
}
