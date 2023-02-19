import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '/lib/auth';
import { connectDB } from '/lib/db';

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await connectDB();

        const memberCollection = client.db().collection('members');

        const member = await memberCollection.findOne({
          email: credentials.email,
        });

        if (!member) {
          client.close();
          throw new Error('No member found!');
        }

        const isValid = await verifyPassword(
          credentials.password,
          member.password
        );

        if (!isValid) {
          client.close();
          throw new Error('Invalid Credentials!');
        }

        client.close();
        return { email: member.email };
      },
    }),
  ],

  secret: process.env.SECRET,
});
