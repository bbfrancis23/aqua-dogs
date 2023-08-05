import Member from '../../../mongo/schemas/MemberSchema'
import db from '/mongo/db'
const nodemailer = require('nodemailer')

const handler = async (req, res) => {
  if (req.method === 'POST') {
    console.log('post trying to send reset code')
    await db.connect()

    if (req.body.email) {
      const {email} = req.body

      if (!email || !email.includes('@')) {
        await db.disconnect()
        res.status(422).json({message: 'Invalid Input'})
        return
      }

      let existingUser = {}
      try {
        existingUser = await Member.findOne({email})
      } catch (error) {
        await db.disconnect()
        res.status(500).json({message: `Server Error:  ${error}`})
        return
      }

      if (existingUser) {
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
          // verify connection configuration
          transporter.verify((error, success) => {
            if (error) {
              console.log(error)
              reject(error)
            } else {
              console.log('Server is ready to take our messages')
              resolve(success)
            }
          })
        })

        console.log('found user')
        const code = Math.floor(100000 + Math.random() * 900000)
        const authTime = new Date()

        try {
          await Member.updateOne({email}, {$set: {authTime, authCode: code}})
        } catch (e) {
          console.log(e)
        }

        const mailOptions = {
          from: 'admin@brian-francis.net',
          to: email,
          subject: 'Reset Instructions',
          text: `Use this code to reset your password: ${code}`,
        }

        console.log('try to send code\n')

        await new Promise((resolve, reject) => {
          // send mail
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.error(err)
              reject(err)
            } else {
              console.log(info)
              resolve(info)
            }
          })
        })

        // try {
        //   const result = await transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //       return console.log('Error in sending mail')
        //     }
        //     console.log('Success')
        //   })

        //   console.log('result\n', result)
        // } catch (e) {
        //   console.log('error\n', e)
        // }

        console.log('transporter sent\n')

        await db.disconnect()
        res.status(200).json({
          message: 'Reset Email sent',
        })
      } else {
        await db.disconnect()
        res.status(404).json({message: 'User not found'})
      }
    } else {
      await db.disconnect()
      res.status(422).json({message: 'Invalid Input'})
    }
  }
}

export default handler
