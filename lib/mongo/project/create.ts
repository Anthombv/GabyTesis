import { NextApiRequest, NextApiResponse } from "next";
import { FactureProject } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, ProjectModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const project = req.body as FactureProject;
  const userName = req.headers.username as string;
  // fetch the posts
  const newProject = new ProjectModel(project);

  await newProject.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un Proyecto: "+project.name,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Proyecto Creado",
    success: true,
  });
}
