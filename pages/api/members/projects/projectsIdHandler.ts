import type {NextApiRequest, NextApiResponse} from 'next'
import {patchProject} from '@/mongo/controls/member/project/patchProject'
import {Project} from '@/react/project/project-types'
import axios from 'axios'

import {forbiddenResponse, notFoundResponse, unauthorizedResponse} from '@/mongo/controls/responses'

export type PatchProjectResponse = {
  message: string
  project?: Project | null | undefined
}

const projectsIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<PatchProjectResponse>
) => {
  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    res.status(axios.HttpStatusCode.MethodNotAllowed).json({
      message: 'Invalid Method',
    })
    return
  }

  await patchProject(req, res)
  return
}

export default projectsIdHandler

// QA: Brian Francis 8-24-23
