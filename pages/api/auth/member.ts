import {NextApiRequest, NextApiResponse} from 'next'
import axios from 'axios'
import {updateMember} from '@/mongo/controls/member/memberControls'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PATCH') {
    res.status(axios.HttpStatusCode.NotAcceptable).json({message: 'Method Not Allowed'})
  }

  if (req.method === 'PATCH') {
    updateMember(req, res)
    return
  }
}

export default handler
