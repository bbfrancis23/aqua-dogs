import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import Role from '../../../mongoose_models/Role';
import Member from '../../../mongoose_models/Member';

import db from '../../../utils/db';

import bcryptjs from 'bcryptjs';

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, member }) {
      if (member?._id) token._id = member._id;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.member._id = token._id;

      const member = await Member.findOne({
        email: session.user.email,
      }).populate({ path: 'roles', model: Role });

      const roles = member.roles.map((r) => r.title);

      session.user.roles = roles;

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

        console.log('roles', roles);

        await db.disconnect();

        if (member) {
          const result = bcryptjs.compareSync(
            credentials.password,
            member.password
          );

          if (result) {
            return {
              _id: member._id,
              name: 'Brian',
              email: member.email,
              image: 'f',
              role: 'admin',
            };
          }
        }

        throw new Error('Invalid Credentials');
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});
