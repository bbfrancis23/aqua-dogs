import {createComment} from 'mongo/controls/member/project/items/comments/createComment'
import {NextApiRequest, NextApiResponse} from 'next'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('comments handler')

  if (req.method === 'POST') {
    await createComment(req, res)
    return
  }
}
export default handler
