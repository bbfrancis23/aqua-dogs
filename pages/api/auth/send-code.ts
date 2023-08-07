import Member from '@/mongo/schemas/MemberSchema'
import db from '@/mongo/db'
import {NextApiRequest, NextApiResponse} from 'next'
import axios from 'axios'
const nodemailer = require('nodemailer')

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(axios.HttpStatusCode.NotAcceptable).json({message: 'Method Not Allowed'})
  }

  if (!req.body.email) {
    res.status(axios.HttpStatusCode.NotAcceptable).json({message: 'Missing Input'})
  }
  const {email} = req.body

  if (!email || !email.includes('@')) {
    res.status(axios.HttpStatusCode.NotAcceptable).json({message: 'Invalid Input'})
    return
  }

  await db.connect()

  let existingUser = await Member.findOne({email})

  if (!existingUser) {
    await db.disconnect()
    res.status(axios.HttpStatusCode.NotFound).json({message: 'User not found'})
  }

  console.log(existingUser)
  if (existingUser.locked) {
    await db.disconnect()
    res
      .status(axios.HttpStatusCode.Locked)
      .json({message: 'Member account is locked. Please contact support'})
    return
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    secure: true,
    port: 465,
    auth: {
      user: 'admin@brian-francis.net',
      pass: process.env.MAIL,
    },
  })

  await new Promise((resolve, reject) => {
    transporter.verify(async (error: string, success: unknown) => {
      if (error) {
        await db.disconnect()
        res.status(axios.HttpStatusCode.InternalServerError).json({message: 'Unable to send email'})
        console.error('error verify', error)
        reject(error)
      } else {
        console.log('Server is ready to take our messages')
        resolve(success)
      }
    })
  })

  const code = Math.floor(100000 + Math.random() * 900000)
  const authTime = new Date()

  try {
    await Member.updateOne({email}, {$set: {authTime, authCode: code}})
  } catch (e) {
    console.log(e)
    await db.disconnect()
    res.status(axios.HttpStatusCode.InternalServerError).json({message: 'Unable to update user'})
  }

  const mailOptions = {
    from: 'admin@brian-francis.net',
    to: email,
    subject: 'Reset Instructions',
    text: `Use this code to reset your password: ${code}`,
  }

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, async (err: string, info: unknown) => {
      if (err) {
        await db.disconnect()
        res.status(axios.HttpStatusCode.InternalServerError).json({message: 'Unable to '})
        console.error('error sendMail', err)
        reject(err)
      } else {
        console.log('success email sent')
        console.log(info)
        resolve(info)
      }
    })
  })

  await db.disconnect()
  res.status(axios.HttpStatusCode.Ok).json({
    message: 'Reset Email sent',
  })
}

export default handler

// QA: Brian Francis 8-6-2023
