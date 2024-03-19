import { Request, Response } from "express";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";
import { getComment, deleteComment } from "../db/slices/evaluation.js";
import { IProductComment } from "../lib/types.js";

export async function deleteCommentController(req: Request, res: Response<IResponse>) {
  try {
    const response = getResponseTemplate();
    let message: string;
    const { forUser } = req.body;
    const { commentId } = req.query;
    let comment: { comment: IProductComment } | null;

    if (commentId) {
      comment = await getComment(+commentId);

      if (comment) {
        if (forUser.status === "admin" || comment.comment.user_id === forUser.id) {
          await deleteComment(+commentId);

          response.data = {
            data: comment
          };
          return res.status(200).json(response);
        }

        message = "403 Forbidden"; // прав на удаление комментария нет
        response.error = {
          message
        };
        return res.status(403).json(response);
      }
    }

    message = "The comment not found"; // в случае неверного comment_id
    response.error = {
      message
    };
    return res.status(404).json(response);
  } catch (err) {
    const message: string = "500 Server Error";
    const response = getResponseTemplate();
    response.error = {
      message
    };
    res.status(500).json(response);
  }
}
