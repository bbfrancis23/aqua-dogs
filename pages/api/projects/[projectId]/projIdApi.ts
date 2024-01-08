import {Project} from '@/react/project'
import {NextApiRequest, NextApiResponse} from 'next'

export type PatchProjectResponse = {
  message: string
  project?: Project | null | undefined
}

const projIdApi = async (req: NextApiRequest, res: NextApiResponse<PatchProjectResponse>) => {
  switch (req.method) {
    case 'PATCH':
      // await patchProject(req, res)
      break
    case 'DELETE':
      // await deleteProject(req, res)
      break
    default:
      res.status(405).json({message: 'Invalid Method'})
      break
  }
  return
}
