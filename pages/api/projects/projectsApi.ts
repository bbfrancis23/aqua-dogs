import createProject from '@/mongo/controls/project/createProject'
import {NextApiRequest, NextApiResponse} from 'next'

export const projectsApi = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      // await getProjects(req, res)
      break
    case 'POST':
      await createProject(req, res)
      break
    default:
      res.status(405).json({message: 'Invalid Method'})
      break
  }
  return
}
