import { patchProject } from '/mongo/controls/project/patchProject';

const handler = async (req, res) => {
  if (req.method === 'PATCH') {
    console.log('trying to patch project ');

    await patchProject(req, res);
    return;
  }
  return;
};

export default handler;
