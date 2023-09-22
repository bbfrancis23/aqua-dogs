import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

import GoogleProvider from 'next-auth/providers/google'
import Member from '../../../mongo/schemas/MemberSchema'

import db from '../../../mongo/db'
import {findMember} from '../../../mongo/controls/member/memberControls'

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
    async signIn({user, account, profile, email, credentials}) {
      if (account?.provider === 'google') {
        const member = await findMember(user?.email)
        if (!member) {
          await db.connect()
          const newMember = new Member({
            email: user?.email,
            name: user?.name,
          })
          await newMember.save()
          await db.disconnect()
        }

        if (member) {
          if (user.image) {
            console.log('adding image', user.image, user.email)

            await db.connect()
            try {
              await Member.updateOne({email: user.email}, {$set: {image: user.image}})
            } catch (err) {
              console.log(err)
            }
            await db.disconnect()
          }
        }
      }

      return true
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
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
})
