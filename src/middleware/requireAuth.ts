import type { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../services/jwt.service.js";
import { findsessionByToken } from "../services/session.service.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = String(req.headers.authorization ?? "");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Autorization token missing" });
    }

    const parts = authHeader.split(" ");
    const token = parts[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const payload = verifyJwt(token);

    (req as unknown as { user?: typeof payload }).user = payload;

    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Authorization token missing" });
  }
}

export async function requireAuthCokkie(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authCokkie = req.cookies && req.cookies.refreshToken;
    if (!authCokkie)
      return res.status(401).json({ message: "Autorization token missing" });

    const dataToken = await findsessionByToken(authCokkie);
    if (!dataToken) return res.status(402).send("Problem token validation");

    if (dataToken.refreshToken !== authCokkie)
      return res.status(403).send("Unauthorized token");

    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Authorization token missing" });
  }
}

export async function requireAuthCokkieRedirect(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authCokkie = req.cookies && req.cookies.refreshToken;
    if (!authCokkie) return res.redirect("/login");
    // if (!authCokkie) return res.status(401).send("Autorization token missing")

    const dataToken = await findsessionByToken(authCokkie);
    if (!dataToken) return res.redirect("/login");
    // if(!dataToken) return res.status(402).send("Problem token validation")

    if (dataToken.refreshToken !== authCokkie) return res.redirect("/login");
    // if (dataToken.refreshToken !== authCokkie) return res.status(403).send("Unauthorized token")

    return next();
  } catch (error) {
    console.error(error);
    // return res.status(401).send("Authorization token missing")
    return res.redirect("/login");
  }
}
