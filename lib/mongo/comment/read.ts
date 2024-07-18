import { NextApiRequest, NextApiResponse } from "next";
import { Comment } from "../../types";
import { CommentModel } from "../schemas";

export default async function handler( 
  req: NextApiRequest,
  res: NextApiResponse
 
) {
    const id = req.query.id as string

    const comment = await CommentModel.findById(id)

    return res.status(200).json({
        message: "un comentario",
        data: comment as Comment,
        success: true,
    })
}
