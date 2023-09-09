import {patchComment} from '@/mongo/controls/member/project/items/comments/patchComment'
import {NextApiRequest, NextApiResponse} from 'next/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    await patchComment(req, res)
    return
  }
  // else if (req.method === 'DELETE') {
  //   await deleteComment(req, res)
  //   return
  // }
}
