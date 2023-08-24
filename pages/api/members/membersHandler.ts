import {NextApiRequest, NextApiResponse} from 'next'
import {getSession} from 'next-auth/react'

import axios from 'axios'

import {findMembers} from '@/mongo/controls/member/memberControls'
import {Member} from '@/interfaces/MemberInterface'

const membersHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(axios.HttpStatusCode.MethodNotAllowed).json({
      message: 'Invalid Method',
    })
    return
  }

  const session = await getSession({req})
  if (!session) {
    res.status(axios.HttpStatusCode.Unauthorized).json({
      message: 'Invalid Session',
    })
    return
  }

  let members: Member[] = []

  try {
    members = await findMembers()
  } catch (e) {
    res.status(axios.HttpStatusCode.InternalServerError).json({
      message: `Error finding Member:  e`,
    })
    return
  }

  res.status(axios.HttpStatusCode.Ok).json({
    message: 'Success',
    members,
  })
  return
}

export default membersHandler

// QA: Brian Francis 8-24-23
// Security: Brian Francis 8-24-23 - Only allow GET requests from authenticated users - Tested
