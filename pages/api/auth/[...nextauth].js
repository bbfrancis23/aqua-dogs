import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import Member from '../../../mongo/schemas/MemberSchema'

import db from '../../../mongo/db'

import bcryptjs from 'bcryptjs'

import axios from 'axios'

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({token, member}) {
      if (member?._id) token._id = member._id
      return token
    },
    async session({session, token}) {
      if (token?._id) session.member._id = token._id

      await db.connect()

      const member = await Member.findOne({
        email: session.user.email,
      })

      session.user.id = token.sub

      await db.disconnect()
      return session
    },
  },

  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect()

        const member = await Member.findOne({
          email: credentials.email,
        })

        if (member) {
          if (member.locked) {
            await db.disconnect()

            throw new Error(
              JSON.stringify({
                errors: 'Account is Locked. Please Contact Support',
                status: axios.HttpStatusCode.Locked,
              })
            )
          } else {
            const result = bcryptjs.compareSync(credentials.password, member.password)

            if (result) {
              await Member.updateOne({email: credentials.email}, {$set: {invalidCount: 0}})
              await db.disconnect()

              return {
                _id: member._id,
                id: member._id,
                name: member.name ? member.name : undefined,
                email: member.email,
                image: 'f',
              }
            }
          }
        }

        let invalidCount = member.invalidCount || 0
        invalidCount++
        await Member.updateOne({email: credentials.email}, {$set: {invalidCount}})

        if (invalidCount >= 5) {
          await Member.updateOne({email: credentials.email}, {$set: {locked: true}})
          await db.disconnect()
        }

        throw new Error(
          JSON.stringify({
            errors: 'Ivalid Credentials',
            status: axios.HttpStatusCode.Unauthorized,
          })
        )
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
})
