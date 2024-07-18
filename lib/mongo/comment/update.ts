import { NextApiRequest, NextApiResponse } from "next";
import { Comment } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, CommentModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const comment = req.body as Comment;
  const userName = req.headers.username as string;
  const resp = await CommentModel.findOneAndUpdate(
    {
      _id: comment.id,
    },
    comment
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizo el comentario",
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "Comentario no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "Comentario Editado",
    success: true,
  });
}
