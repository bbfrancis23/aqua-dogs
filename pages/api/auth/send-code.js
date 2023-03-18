import Member from '../../../mongoose_models/Member';
import db from '/utils/db';
var nodemailer = require('nodemailer');

async function handler(req, res) {
  if (req.method === 'POST') {
    await db.connect();

    if (req.body.email) {
      const email = req.body.email;

      if (!email || !email.includes('@')) {
        res.status(422).json({ message: 'Invalid Input' });
        return;
      }

      let existingMember;

      let existingUser;
      try {
        existingUser = await Member.findOne({ email });
      } catch (error) {
        await db.disconnect();
        res.status(500).json({ message: `Server Error:  ${error}` });
        return;
      }

      if (existingUser) {
        // console.log('mail', process.env.MAIL);

        const password = process.env.MAIL;

        console.log(password);

        const transporter = nodemailer.createTransport({
          host: 'smtp.zoho.com',
          secure: true,
          port: 465,
          auth: {
            user: 'admin@brian-francis.net',
            pass: process.env.MAIL,
          },
        });

        const mailOptions = {
          from: 'admin@brian-francis.net',
          to: email,
          subject: 'Reset Instructions',
          text: 'That was easy!',
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

        res.status(200).json({
          message: 'Reset Email sent',
        });
        return;
      }
    } else {
      res.status(422).json({ message: 'Invalid Input' });
      return;
    }
  }
}

export default handler;
