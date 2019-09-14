import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */
export const index = (req: Request, res: Response) => {
    return res.json({
        message: "I am working"
    });
};
