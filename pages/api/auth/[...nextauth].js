import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import Role from '../../../mongoose_models/Role';
import Member from '../../../mongoose_models/Member';

import db from '../../../mongo/db';

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


      await db.connect();
      console.log('trying to get seesion');

      console.log('session', session);

      try {
        const member = await Member.findOne({
          email: session.user.email,
        }).populate({ path: 'roles', model: Role });

        const roles = member.roles.map((r) => r.title);

      session.user.id = token.sub;

      session.user.roles = roles;


      console.log('session:', session);
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

        // console.log('roles', roles);

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
