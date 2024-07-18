import { NextApiRequest, NextApiResponse } from "next"
import { Comment } from "../../types"
import FormatedDate from "../../utils/formated_date"
import { AuditoryModel,  CommentModel } from "../schemas"

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    const comment = req.body as Comment
    const userName = req.headers.username as string
   
    const newComment = new CommentModel(comment) 

    await newComment.save()

    const auditory = new AuditoryModel({
        date: FormatedDate(),
        user: userName,
        action: "Creo un comentario"
    })
    await auditory.save()

    return res.status(200).json({
        message: "Comentario creado",
        success: true,
    })
}
