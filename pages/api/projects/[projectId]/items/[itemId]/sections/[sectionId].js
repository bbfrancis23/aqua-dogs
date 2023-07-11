import { patchSection } from 'mongo/controllers/sectionControllers/patchSection';
import { deleteSection } from 'mongo/controllers/sectionControllers/deleteSection';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    await patchSection(req, res);
    return;
  } else if (req.method === 'DELETE') {
    await deleteSection(req, res);
    return;
  }
}
