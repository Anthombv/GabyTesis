import { NextApiRequest, NextApiResponse } from "next"
import FormatedDate from "../../lib/utils/formated_date"
import { AuditoryModel, CommentModel } from "../../model/schemas"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const id = req.query.id as string
    const userName= req.headers.username as string
    const resp = await CommentModel.findByIdAndRemove(id)

    const auditory = new AuditoryModel({
        date: FormatedDate(),
        user: userName,
        action: "Elimino un Comentario",
    })
    await auditory.save()

    if (resp.deletedCount === 1)
    return res.status(200).json({
        message: "Eliminado",
        success: true,
    })

    return res.status(500).json({
        message: "Error inesperado",
        success: false,
    })
}