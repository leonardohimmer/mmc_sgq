import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const path = req.nextUrl.pathname

        if (path.startsWith("/sgq")) {
            if (!token) {
                return NextResponse.redirect(new URL("/login", req.url))
            }

            // Example of basic role protection later:
            // if (path.startsWith("/sgq/admin") && token.role !== "ADMIN") { ... }
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
        }
    }
)

export const config = {
    matcher: ["/sgq/:path*"],
}
