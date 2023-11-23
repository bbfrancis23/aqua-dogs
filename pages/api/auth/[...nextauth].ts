import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

import GoogleProvider from 'next-auth/providers/google'
import Member from '../../../mongo/schemas/MemberSchema'

import db from '../../../mongo/db'
import {findMember} from '../../../mongo/controls/member/memberControls'

import bcryptjs from 'bcryptjs'

import axios from 'axios'
import {SessionStrategy} from 'next-auth'

/* eslint-disable */

export const authOptions = {
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  callbacks: {
    jwt({token, member}: any) {
      if (member?._id) token._id = member._id
      return token
    },
    async signIn({user, account, profile, email, credentials}: any) {
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
    async session({session, token}: any) {
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
      name: 'Credentials',
      credentials: {
        email: {label: 'Email', type: 'email'},
        username: {label: 'Username', type: 'text'},
        password: {label: 'Password', type: 'password'},
      },
      authorize: async (credentials) => {
        if (!credentials) throw new Error('No Credentials')

        if (!credentials.email || !credentials.password) {
          throw new Error(
            JSON.stringify({
              errors: 'Ivalid Credentials',
              status: axios.HttpStatusCode.Unauthorized,
            })
          )
        }

        await db.connect()

        const member = await Member.findOne({
          email: credentials?.email,
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
                image: member.image ? member.image : undefined,
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
      clientId: process.env.GOOGLE_ID ? process.env.GOOGLE_ID : '',
      clientSecret: process.env.GOOGLE_SECRET ? process.env.GOOGLE_SECRET : '',
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
