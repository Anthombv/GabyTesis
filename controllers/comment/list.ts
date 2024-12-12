import { NextApiRequest, NextApiResponse } from "next";
import { Comment } from "../../model";
import { CommentModel } from "../../model/schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const comments = await CommentModel.find({})

    return res.status(200).json({
        message: "Todos los comentarios",
        data: comments as Array<Comment>,
        success: true,
    })
}
