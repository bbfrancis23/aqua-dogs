import createBoard from '@/mongo/controls/board/createBoard'
import {NextApiRequest, NextApiResponse} from 'next'

export const boardApi = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      // await getProjects(req, res)
      break
    case 'POST':
      await createBoard(req, res)
      break
    default:
      res.status(405).json({message: 'Invalid Method'})
      break
  }
  return
}
