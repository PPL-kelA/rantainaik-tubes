import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { verifyCredentials } from "@/modules/auth/service";
import { Role, AccountStatus } from "@/modules/auth/schema";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      status: AccountStatus;
      organizationId: string | null;
      organizationName: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
    status: AccountStatus;
    organizationId: string | null;
    organizationName: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    status?: AccountStatus;
    organizationId?: string | null;
    organizationName?: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await verifyCredentials(
            credentials.email as string,
            credentials.password as string
          );
          return user;
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
