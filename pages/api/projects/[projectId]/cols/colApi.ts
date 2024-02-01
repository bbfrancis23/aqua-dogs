import {updateCols} from '@/mongo/controls/col/updateCols'
import {NextApiRequest, NextApiResponse} from 'next'

export const colsApi = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    // case 'GET':
    //   // await getProjects(req, res)
    //   break
    // case 'POST':
    //   // await createBoard(req, res)
    //   break
    case 'PATCH':
      await updateCols(req, res)
      break
    default:
      res.status(405).json({message: 'Invalid Method'})
      break
  }
  return
}
