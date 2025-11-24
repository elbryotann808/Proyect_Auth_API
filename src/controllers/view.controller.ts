import type { Request, Response } from "express"

export function pageLogin (req: Request, res: Response){
  res.render("login")
}

export function pageRegister (req: Request, res: Response){
  res.render("register")
}

export function pageHome (req: Request, res: Response){ 
  res.render("home")
}