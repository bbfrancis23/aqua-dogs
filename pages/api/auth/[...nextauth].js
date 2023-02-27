import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import Member from '../../../mongoose_models/Member';

import db from '../../../utils/db';

import bcryptjs from 'bcryptjs';

// import { verifyPassword } from '/lib/auth';
// import { connectDB } from '/lib/db';

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

      return session;
    },
  },

  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();

        const member = await Member.findOne({ email: credentials.email });
        await db.disconnect();

        console.log(member);

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
              role: 'Admin',
            };
          }
          console.log(result, credentials.password, member.password);
        }

        throw new Error('Invalid Credentials');
      },
    }),
  ],
});

// export default NextAuth({
//   session: {
//     jwt: true,
//   },
//   providers: [
//     CredentialsProvider({
//       async authorize(credentials) {
//         const client = await connectDB();

//         const memberCollection = client.db().collection('members');

//         const member = await memberCollection.findOne({
//           email: credentials.email,
//         });

//         if (!member) {
//           client.close();
//           throw new Error('No member found!');
//         }

//         const isValid = await verifyPassword(
//           credentials.password,
//           member.password
//         );

//         if (!isValid) {
//           client.close();
//           throw new Error('Invalid Credentials!');
//         }

//         client.close();
//         // TODO Add name and profile img later
//         return { email: member.email, name: 'Brian', image: '' };
//       },
//     }),
//   ],

//   secret: process.env.SECRET,
// });
