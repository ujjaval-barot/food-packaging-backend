import { Request, Response, NextFunction, RequestHandler } from "express";

export const authorize = (roles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      const error = new Error("Unauthorized: Authentication required");
      (error as any).status = 401;
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error("Forbidden: Access is denied");
      (error as any).status = 403;
      return next(error);
    }

    next();
  };
};
