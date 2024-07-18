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
  const resp = await ProjectModel.findOneAndUpdate(
    {
      _id: project.id,
    },
    project
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizo un Proyecto: "+resp.name+" a: "+project.name,
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "Proyecto no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "Banco editado",
    success: true,
  });
}
