import { NextApiRequest, NextApiResponse } from "next";
import { FactureProject } from "../../types";
import { ProjectModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch the posts
  const projects = await ProjectModel.find({}).sort( { "name": 1 } )

  return res.status(200).json({
    message: "Todos los Proyectos",
    data: projects as Array<FactureProject>,
    success: true,
  });
}