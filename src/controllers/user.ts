import { Request, Response, NextFunction } from "express";

/**
 * POST /signup
 * Create a new local account.
 */
export const postSignup = (req: Request, res: Response, next: NextFunction) => {
    return res.json({
        message: "I am alive"
    });
};