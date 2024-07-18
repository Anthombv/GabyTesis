import { NextApiRequest, NextApiResponse } from "next";
import { FactureProject } from "../../types";
import { ProjectModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const project = await ProjectModel.findById(id)

  return res.status(200).json({
    message: "un usuario",
    data: project as FactureProject,
    success: true,
  });
}