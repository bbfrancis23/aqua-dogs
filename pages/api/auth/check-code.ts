import db from '@/mongo/db'

import Member from '@/mongo/schemas/MemberSchema'
import axios from 'axios'

import bcryptjs from 'bcryptjs'
import {NextApiRequest, NextApiResponse} from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(axios.HttpStatusCode.NotAcceptable).json({message: 'Method Not Allowed'})
  }

  if (!req.body.email || !req.body.code || !req.body.newPassword) {
    res.status(axios.HttpStatusCode.BadRequest).json({message: 'Missing input'})
  }

  await db.connect()
  const member = await Member.findOne({email: req.body.email})

  if (!member) {
    await db.disconnect()
    res.status(axios.HttpStatusCode.NotFound).json({message: 'Member not found'})
    return
  }

  if (member.authCode !== req.body.code) {
    let invalidCount = member.invalidCount || 0
    invalidCount++
    await Member.updateOne({email: req.body.email}, {$set: {invalidCount}})

    if (invalidCount > 5) {
      await Member.updateOne({email: req.body.email}, {$set: {locked: true}})
      await db.disconnect()
      res
        .status(axios.HttpStatusCode.Locked)
        .json({message: 'Your account has been locked. Please contact support'})
      return
    }

    await db.disconnect()
    res.status(axios.HttpStatusCode.BadRequest).json({message: 'Invalid Code'})
    return
  }

  const date1 = new Date(member.authTime).getTime()
  const date2 = new Date().getTime()

  const diffTime: number = Math.abs(date2 - date1)

  const diff = diffTime / 1000 / 60

  if (diff > 10) {
    await db.disconnect()
    res.status(400).json({message: 'Code is no longer valid'})
    return
  }

  const hashedPassword = await bcryptjs.hash(req.body.newPassword, 12)

  await Member.updateOne({email: req.body.email}, {$set: {password: hashedPassword}})

  await db.disconnect()
  res.status(200).json({message: 'Password updated!'})
}

export default handler
