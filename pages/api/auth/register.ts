import bcryptjs from 'bcryptjs'
import db from '@/mongo/db'

import Member from '@/mongo/schemas/MemberSchema'

import {NextApiRequest, NextApiResponse} from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return
  }

  const data = req.body
  const {email, password} = data

  if (!email || !email.includes('@') || !password || password.trim().length < 6) {
    res.status(422).json({message: 'Invalid Input'})
    return
  }

  await db.connect()

  let existingUser: string | null = ''
  try {
    existingUser = await Member.findOne({email})
  } catch (error) {
    await db.disconnect()
    res.status(500).json({message: `Server Error:  ${error}`})
    return
  }

  if (existingUser) {
    await db.disconnect()
    res.status(422).json({
      message: 'Could not register new memeber. Member already exists.',
    })
    return
  }

  const hashedPassword = await bcryptjs.hash(password, 12)

  const newMember = new Member({email, password: hashedPassword})

  try {
    await newMember.save()
  } catch (error) {
    await db.disconnect()
    res.status(500).json({message: `Server Error:  ${error}`})
    return
  }

  await db.disconnect()
  res.status(201).json({message: 'New Member Registered'})
}
export default handler

// QA: done 08-04-23
