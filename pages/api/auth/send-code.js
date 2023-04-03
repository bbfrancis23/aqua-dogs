import Member from '../../../mongo/schemas/MemberSchema';
import db from '/mongo/db';
const nodemailer = require('nodemailer');

async function handler(req, res) {
  if (req.method === 'POST') {
    await db.connect();

    if (req.body.email) {
      const { email } = req.body;

      if (!email || !email.includes('@')) {
        await db.disconnect();
        res.status(422).json({ message: 'Invalid Input' });
        return;
      }

      let existingUser;
      try {
        existingUser = await Member.findOne({ email });
      } catch (error) {
        await db.disconnect();
        res.status(500).json({ message: `Server Error:  ${error}` });
        return;
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
        });

        const code = Math.floor(100000 + Math.random() * 900000);
        const authTime = new Date();

        try {
          await Member.updateOne(
            { email },
            { $set: { authTime, authCode: code } }
          );
        } catch (e) {
          console.log(e);
        }

        const mailOptions = {
          from: 'admin@brian-francis.net',
          to: email,
          subject: 'Reset Instructions',
          text: `Use this code to reset your password: ${code}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

        await db.disconnect();
        res.status(200).json({
          message: 'Reset Email sent',
        });
      } else {
        await db.disconnect();
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      await db.disconnect();
      res.status(422).json({ message: 'Invalid Input' });
    }
  }
}

export default handler;
