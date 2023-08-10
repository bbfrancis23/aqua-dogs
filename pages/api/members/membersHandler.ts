import Member from '@/mongo/schemas/MemberSchema'

import {getSession} from 'next-auth/react'
import {getMembers} from '@/mongo/controllers/memberControllers'

import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'
const membersHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let status = axios.HttpStatusCode.BadRequest
  let message = 'Invalid Method'
  let members = null

  if (req.method === 'GET') {
    const session = await getSession({req})

    if (session) {
      try {
        members = await getMembers()
      } catch (e) {
        status = axios.HttpStatusCode.InternalServerError
        message = `Error: ${e}`
      }

      status = axios.HttpStatusCode.Ok
      message = 'Success'
    } else {
      status = axios.HttpStatusCode.Unauthorized
      message = 'Not Authenticated'
    }
  }

  res.status(status).json({
    message,
    members,
  })
}

export default membersHandler

// QA: Brian Francis 8-10-23
