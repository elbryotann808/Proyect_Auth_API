import jwt from "jsonwebtoken"

export interface jwtPayLoadCustom {
  sub: string
  email?: string 
  role: string
}

const JWT_SECRET = process.env.JWT_SECRET ?? ""
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] ?? "1h"

if (!JWT_SECRET) throw new Error("JWT_SECRET is required in env")


export function signJwt(payLoad: jwtPayLoadCustom, options?: jwt.SignOptions): string {
  try {
    const SignOptions: jwt.SignOptions = {
      expiresIn: JWT_EXPIRES_IN,
      ...options,
    }
    return jwt.sign(payLoad, JWT_SECRET, SignOptions) as string
  } catch (error) {
    throw new Error(String(error))
  }
}

export function verifyJwt(token: string): jwtPayLoadCustom {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload | string;
    if (typeof decoded === "string" || !decoded.sub) {
      throw new Error("Invalid token payload")
    }

    return{
      sub: String(decoded.sub),
      ...(decoded.email && {email: decoded.email} )
    }
  } catch (error) {
    throw new Error(String(error))
  }
}