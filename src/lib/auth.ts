import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                await dbConnect();
                const user = await User.findOne({ email: credentials.email });
                if (!user) return null;
                const isMatch = await bcrypt.compare(credentials.password, user.password);
                if (!isMatch) return null;
                return { id: user._id.toString(), name: user.name, email: user.email };
            },
        }),
    ],
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user, trigger }) {
            if (trigger === 'signIn' || trigger === 'signUp' || user) {
                // Determine user ID
                const userId = user?.id || token.sub;

                if (userId) {
                    await dbConnect();
                    const dbUser = await User.findById(userId);

                    if (dbUser) {
                        const now = new Date();
                        const today = new Date(now.setHours(0, 0, 0, 0));

                        let lastLogin = dbUser.streak?.lastLogin ? new Date(dbUser.streak.lastLogin) : null;
                        if (lastLogin) lastLogin = new Date(lastLogin.setHours(0, 0, 0, 0));

                        const oneDay = 24 * 60 * 60 * 1000;
                        const diff = lastLogin ? today.getTime() - lastLogin.getTime() : -1;

                        if (!lastLogin || diff > oneDay) {
                            // Missed > 1 day or first time
                            dbUser.streak = {
                                current: 1,
                                lastLogin: new Date(),
                                best: Math.max(dbUser.streak?.best || 0, 1)
                            };
                            await dbUser.save();
                        } else if (diff === oneDay) {
                            // Consecutive day
                            dbUser.streak.current += 1;
                            dbUser.streak.lastLogin = new Date();
                            if (dbUser.streak.current > dbUser.streak.best) {
                                dbUser.streak.best = dbUser.streak.current;
                            }
                            await dbUser.save();
                        } else if (diff === 0) {
                            // Same day login, do nothing to streak count
                        }

                        // Pass streak and avatar to token
                        token.streak = dbUser.streak?.current || 0;
                        token.avatarId = dbUser.avatarId || 'lion';
                    }
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.sub;
                (session.user as any).streak = token.streak;
                (session.user as any).avatarId = token.avatarId;
            }
            return session;
        },
    },
};
