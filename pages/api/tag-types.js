import dbConnect from "../../lib/dbConnect";
import tagTypesModel from "../../models/TagTypes";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const tagTypes = await tagTypesModel.find({});
        res.status(200).json({ success: true, data: tagTypes });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const tagType = await tagTypesModel.create(req.body);
        res.status(201).json({ success: true, data: tagType });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
