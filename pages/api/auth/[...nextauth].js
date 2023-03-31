import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import Role from '../../../mongo/schemas/RoleSchema';
import Member from '../../../mongo/schemas/MemberSchema';

import db from '../../../mongo/db';

import bcryptjs from 'bcryptjs';

export default NextAuth({
  session: {
    strategy: 'jwt', // comment
  },
  callbacks: {
    async jwt({ token, member }) {
      if (member?._id) token._id = member._id;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.member._id = token._id;

      await db.connect();

      const member = await Member.findOne({
        email: session.user.email,
      }).populate({ path: 'roles', model: Role });

      const roles = member.roles.map((r) => r.title);

      session.user.id = token.sub;

      session.user.roles = roles;
      await db.disconnect();
      return session;
    },
  },

  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();

        const member = await Member.findOne({
          email: credentials.email,
        });

        const roles = member.roles.map((r) => r.title);

        await db.disconnect();

        if (member) {
          const result = bcryptjs.compareSync(
            credentials.password,
            member.password
          );

          if (result) {
            return {
              _id: member._id,
              id: member._id,
              name: member.name ? member.name : undefined,
              email: member.email,
              image: 'f',
            };
          }
        }

        throw new Error('Invalid Credentials');
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});
