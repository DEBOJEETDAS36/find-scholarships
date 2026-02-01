import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      // 🔐 HARD ADMIN CHECK
      return user.email === process.env.ADMIN_EMAIL;
    },
  },

  pages: {
    signIn: "/admin/login",
  },
});

export { handler as GET, handler as POST };
