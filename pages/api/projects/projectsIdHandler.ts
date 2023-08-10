import type {NextApiRequest, NextApiResponse} from 'next'
import {patchProject} from '@/mongo/controls/member/project/patchProject'
import {Project} from '@/interfaces/ProjectInterface'

export type PatchProjectResponse = {
  message: string
  project?: Project | null | undefined
}

const projectsIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<PatchProjectResponse>
) => {
  if (req.method === 'PATCH') {
    await patchProject(req, res)
  } else if (req.method === 'DELETE') {
    await patchProject(req, res)
  }
}

export default projectsIdHandler

// QA: Brian Francis 8-9-23
