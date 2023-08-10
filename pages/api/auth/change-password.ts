import {getSession} from 'next-auth/react'
import bcryptjs from 'bcryptjs'
import Member from '@/mongo/schemas/MemberSchema'
import db from '@/mongo/db'
import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PATCH') {
    res.status(axios.HttpStatusCode.NotAcceptable).json({message: 'Method Not Allowed'})
    return
  }

  const session = await getSession({req})

  if (!session) {
    res.status(axios.HttpStatusCode.Unauthorized).json({message: 'Not Authenticated'})
    return
  }

  const memberEmail = session?.user?.email
  const {oldPassword} = req.body
  const {newPassword} = req.body

  await db.connect()

  const member = await Member.findOne({email: memberEmail})

  if (!member) {
    await db.disconnect()
    res.status(axios.HttpStatusCode.NotFound).json({message: 'Member not found'})
    return
  }

  const currentPassword = member.password

  const isValid = bcryptjs.compareSync(oldPassword, currentPassword)

  if (!isValid) {
    await db.disconnect()
    res.status(axios.HttpStatusCode.Forbidden).json({message: 'Invalid Credentials'})
    return
  }

  const hashedPassword = await bcryptjs.hash(newPassword, 12)

  await Member.updateOne({email: memberEmail}, {$set: {password: hashedPassword}})

  await db.disconnect()
  res.status(axios.HttpStatusCode.Ok).json({message: 'Password updated!'})
}
export default handler

// QA: Brian Francis 8-9-23
