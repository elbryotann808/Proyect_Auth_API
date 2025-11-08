import type { Request, Response } from "express";

export const index = (req: Request , res: Response) => {
  console.log("hi index");
  res.status(200).send("hi index")
}