// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],

//   callbacks: {
//     async signIn({ user }) {
//       // 🔐 HARD ADMIN CHECK
//       return user.email === process.env.ADMIN_EMAIL;
//     },
//   },

//   pages: {
//     signIn: "/admin/login",
//   },
// });

// export { handler as GET, handler as POST };

// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import clientPromise from "@/lib/mongodb";
// import bcrypt from "bcrypt";

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",

//       credentials: {
//         email: {},
//         password: {},
//       },

//       async authorize(credentials) {

//         const client = await clientPromise;
//         const db = client.db("scholarshipDB");

//         const user = await db
//           .collection("users")
//           .findOne({ email: credentials?.email });

//         if (!user) {
//           throw new Error("No user found");
//         }

//         const isValid = await bcrypt.compare(
//           credentials!.password,
//           user.password
//         );

//         if (!isValid) {
//           throw new Error("Wrong password");
//         }

//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.name,
//         };
//       },
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
